# Useful right now

dof <- function(n1, n2) {
  return(n1 + n2 - 2)
}

t_test <- function(n1, n2, mu1, mu2, s1, s2) {
  
  deg_of <- dof(n1, n2)
  
  A <- (n1 + n2)/(n1*n2)
  B <- ((((n1 - 1)*s1)^2) + ((n2 - 1)*s2)^2)/(deg_of)
  
  t <- abs(mu1 - mu2)/(sqrt(A*B))
  
  return(t)
  
}

p_value <- function(n1, n2, mu1, mu2, s1, s2) {
  deg_of <- dof(n1, n2)
  test_statistic <- t_test(n1, n2, mu1, mu2, s1, s2)
  pv <- 2*(pt(-abs(test_statistic), df = deg_of))
  return(pv)
}

conf_int <- function(n, mu, sd, sig = .05) {
  critical_t <- qt(1-sig,(n - 1))
  lower <- mu - sd*critical_t
  upper <- mu + sd*critical_t
  return(c(lower, upper))
}