library(shiny)

pacman::p_load(magrittr, data.table, jsonlite)

source("R/functions.R")

options(scipen = 99)

shinyServer(function(input, output, session) {

  observe({
    
    cat(paste0(c("\n", input$values, "\n"), collapse = " "))

    values <- input$values[1:6]
    
    confint <- input$values[7]/100
    
    num_tails <- input$values[8]
    
    siglev <- 1 - confint
    
    # rm(x, pv, conf_ints, data)

    if (class(values) == "NULL") {

    } else {
      
      x <- matrix(values, ncol = 3, byrow = T)
      
      pv <- p_value(x[1,1], x[2,1], x[1,2],
                    x[2,2], x[1,3], x[2,3])

      conf_ints <- data.table(t(apply(x, 1, function(r) return(round(conf_int(n = r[1], mu = r[2], sd = r[3], sig = siglev), digits = 2)))))
      
      setnames(conf_ints, c("lower", "upper"))
      # x <- matrix(values, ncol = 3, byrow = T)
      # 
      # results_table <- data.table(group = 1:nrow(x),
      #                             sizes = x[,1],
      #                             means = x[,2],
      #                             sds = x[,3]
      # )
      # 
      # conf_ints <- data.table(t(apply(results_table[, .(mu, n)], 1, function(r) conf_int_95(r[1], r[2]))))
      # 
      # setnames(conf_ints, c("lower", "upper"))
      # 
      # results_table <- cbind(results_table, conf_ints)
      results_table <- data.table(mu = x[, 2], conf_ints)
      
      # res <- prop.test(x)
      # 
      pv <- round(pv, digits = 4)
      # 
      if (pv < .0001) { pv <- .00001 }
      # 
      data <- list(pv, results_table)
      
      # 
      jsonData <- toJSON(data)
      # 
      session$sendCustomMessage(type = "jsonData", jsonData)

    }

  })

})