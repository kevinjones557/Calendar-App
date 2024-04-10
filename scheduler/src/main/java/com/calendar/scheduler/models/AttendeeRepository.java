package com.calendar.scheduler.models;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.calendar.scheduler.models.Attendee;

import java.util.List;

@Repository
public interface AttendeeRepository extends CrudRepository<Attendee, Long> {
    @Query("SELECT a.userId FROM Attendee a WHERE a.eventId = :eventid ")
    List<Integer> getUsersFromEvent(@Param("eventid") int eventId);
}