package com.calendar.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
//@EnableJpaRepositories("com.calendar.scheduler.models.*")
//@ComponentScan(basePackages = { "com.calendar.schedule.models.*" })
//@EntityScan("com.calendar.schedule.models.*")   
public class SchedulerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchedulerApplication.class, args);
	}

}
