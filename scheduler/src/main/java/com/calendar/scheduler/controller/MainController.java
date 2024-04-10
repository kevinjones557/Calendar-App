package com.calendar.scheduler.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.calendar.scheduler.models.Event;
import com.calendar.scheduler.models.EventRepository;
import com.calendar.scheduler.models.User;
import com.calendar.scheduler.models.UserRepository;
import com.calendar.scheduler.models.Attendee;
import com.calendar.scheduler.models.AttendeeRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@RestController // This means that this class is a Controller
@RequestMapping(path="/calendar") // This means URL's start with /events (after Application path)
public class MainController {

    @Autowired 
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttendeeRepository attendeeRepository;

    private static final Logger logger = LoggerFactory.getLogger(MainController.class);

    @RequestMapping(path="/event/add")
    @CrossOrigin(origins = "http://localhost:3000")
    public @ResponseBody String addNewEvent(@RequestBody Map<String, Object> json) {
        Event event = new Event(
            (String) json.get("title"),
            LocalDateTime.parse((String) json.get("startTime")),
            LocalDateTime.parse((String) json.get("endTime")),
            (String) json.get("location"),
            (String) json.get("description")
        );

        Event savedEvent = eventRepository.save(event);
        Integer eventId = (Integer) savedEvent.getId();

        List<Integer> attendees = (List<Integer>) json.get("attendees");
        for (Integer userId : attendees) {
            Attendee attendee = new Attendee(eventId, userId);
            attendeeRepository.save(attendee);
        }

        return "Event Saved";
    }

    @RequestMapping(path="/user/add") // Map ONLY POST Requests
    @CrossOrigin(origins = "http://localhost:3000")
    public @ResponseBody ResponseEntity<String> addNewUser (@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        userRepository.save(user);
        return ResponseEntity.ok("User saved successfully");
    }

    @GetMapping(path="/allUsers")
    @CrossOrigin(origins = "http://localhost:3000")
    public @ResponseBody Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }   

    @RequestMapping(path="/users")
    @CrossOrigin(origins = "http://localhost:3000")
    public User getUserByUsername(@RequestBody String username) {
        return userRepository.findByUsername(username);
    }

   @DeleteMapping("/deleteuser/{userId}")
   @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> deleteUserById(@PathVariable Long userId) {
        try {
            userRepository.deleteById(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/updateuser/{userId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        // Retrieve the existing user from the database
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException());

        // Check if the updated username already exists
        if (!existingUser.getUsername().equals(updatedUser.getUsername()) &&
                userRepository.existsByUsername(updatedUser.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());

        // Save the updated user to the database
        userRepository.save(existingUser);

        return ResponseEntity.ok("User updated successfully");
    }

    @GetMapping("/getEvents")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<Event> getEventsByMonthAndYear(@RequestParam int month, @RequestParam int year) {
        return eventRepository.findAllByMonthAndYear(month, year);
    }

    @GetMapping("/getEventAttendees")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<User> getEventAttendees(@RequestParam int eventId) {
        List<Integer> userIds = attendeeRepository.getUsersFromEvent(eventId);
        List<User> users = new ArrayList<>();

        for (Integer userId : userIds) {
            Optional<User> userOptional = userRepository.findById(userId.longValue());
            userOptional.ifPresent(users::add);
        }

        return users;
    }

    

    
}
