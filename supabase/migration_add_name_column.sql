-- Migration to add name column to voice_notes table
-- Run this if you have an existing database without the name column

ALTER TABLE public.voice_notes 
ADD COLUMN IF NOT EXISTS name text;
