-- ============================
-- Phase 6: 소셜 기능 스키마
-- ============================

-- 1. room_likes 테이블 (방 좋아요)
CREATE TABLE IF NOT EXISTS room_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room_owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, room_owner_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_room_likes_owner ON room_likes(room_owner_id);
CREATE INDEX IF NOT EXISTS idx_room_likes_user ON room_likes(user_id);

-- 2. profiles에 likes_received 칼럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likes_received INT DEFAULT 0;

-- 3. RLS 정책
ALTER TABLE room_likes ENABLE ROW LEVEL SECURITY;

-- 누구나 좋아요 수 읽기 가능
CREATE POLICY "room_likes_select" ON room_likes
  FOR SELECT USING (true);

-- 본인만 좋아요 추가
CREATE POLICY "room_likes_insert" ON room_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인만 좋아요 삭제
CREATE POLICY "room_likes_delete" ON room_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 4. 좋아요 카운트 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET likes_received = likes_received + 1 WHERE id = NEW.room_owner_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET likes_received = GREATEST(0, likes_received - 1) WHERE id = OLD.room_owner_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_room_like_change
  AFTER INSERT OR DELETE ON room_likes
  FOR EACH ROW EXECUTE FUNCTION update_likes_count();
