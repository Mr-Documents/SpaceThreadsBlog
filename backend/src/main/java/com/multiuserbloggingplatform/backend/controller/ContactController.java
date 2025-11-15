package com.multiuserbloggingplatform.backend.controller;

import com.multiuserbloggingplatform.backend.dto.ContactRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/v1/contact")
@CrossOrigin(origins = "http://localhost:5173") // adjust your frontend port if needed
public class ContactController {

    @PostMapping
    public ResponseEntity<String> handleContact(@Validated @RequestBody ContactRequest request) {
        // Here, you can save the message in DB, or send an email notification.
        System.out.println("New Contact Message:");
        System.out.println("Name: " + request.getName());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Message: " + request.getMessage());

        return ResponseEntity.ok("Thank you for reaching out! We’ll get back to you soon.");
    }

    
}

    

