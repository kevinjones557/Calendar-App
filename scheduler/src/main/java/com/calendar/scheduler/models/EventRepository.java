package com.calendar.scheduler.models;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.calendar.scheduler.models.Event;

import java.util.List;

@Repository
public interface EventRepository extends CrudRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE YEAR(e.startTime) = :year AND MONTH(e.startTime) = :month")
    List<Event> findAllByMonthAndYear(@Param("month") int month, @Param("year") int year);
}
