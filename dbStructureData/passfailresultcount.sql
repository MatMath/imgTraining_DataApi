SELECT 
  result.username, 
  result.success, 
  result.fail_passed, 
  result.positive_failed,
  count(*) as ct
FROM public.result
GROUP BY username,success, fail_passed, positive_failed;