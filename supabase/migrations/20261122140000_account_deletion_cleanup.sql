ALTER TABLE public.developer_supporters
  ALTER COLUMN approved_by DROP NOT NULL;

ALTER TABLE public.developer_supporters
  DROP CONSTRAINT developer_supporters_approved_by_fkey;

ALTER TABLE public.developer_supporters
  ADD CONSTRAINT developer_supporters_approved_by_fkey
  FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
