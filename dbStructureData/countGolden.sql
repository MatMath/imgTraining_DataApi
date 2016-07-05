SELECT COUNT(NULLIF(false, golden.passfail)) AS passimg, COUNT(NULLIF(true, golden.passfail)) AS failedimg
FROM public.golden;