package com.drcp.backend.controller;

import com.drcp.backend.entity.Disasters;
import com.drcp.backend.entity.Users;
import com.drcp.backend.service.DisastersService;
import com.drcp.backend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/disasters")
public class DisastersController {

    @Autowired
    private DisastersService disastersService;

    @Autowired
    private UsersService usersService;

    @GetMapping
    public ResponseEntity<List<Disasters>> getAllDisasters() {
        List<Disasters> disasters = disastersService.fetchAllDisasters();
        System.out.println("disasters fetched are: " + disasters.size());
        if (disasters.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(disasters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Disasters>> getDisasterById(@PathVariable Long id) {
        Optional<Disasters> disaster = disastersService.fetchDisasterById(id);
        if (disaster.isPresent()) {
            return ResponseEntity.ok(disaster);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping()
    public ResponseEntity<?> addNewDisaster(@RequestBody Disasters disaster, Principal principal) {
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {
            System.out.println("Principal: " + principal);
            disaster.setId(null);
            disaster.setOwnerId(principal.getName());
            System.out.println("Principal: " + principal);
            disaster.setCreatedAt(LocalDateTime.now());
            disaster.setAuditTrail("Created by: " + principal.getName() + " at " + LocalDateTime.now());
            List<Double> geoPoint = disastersService.getLatLong(disaster);
            if (geoPoint != null && geoPoint.size() == 2) {
                disaster.setLatitude(geoPoint.get(0));
                disaster.setLongitude(geoPoint.get(1));
            }
            Disasters savedDisaster = disastersService.saveDisaster(disaster);
            return ResponseEntity.ok(savedDisaster);
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateDisasterById(@PathVariable Long id, @RequestBody Disasters disaster, Principal principal) {
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {
            Optional<Disasters> existingDisasterOptional = disastersService.fetchDisasterById(id);
            if (existingDisasterOptional.isPresent()) {
                Disasters existingDisaster = existingDisasterOptional.get();
                existingDisaster.setTitle(disaster.getTitle());
                existingDisaster.setLocationName(disaster.getLocationName());
                List<Double> geoPoint = disastersService.getLatLong(disaster);
                if (geoPoint != null && geoPoint.size() == 2) {
                    existingDisaster.setLatitude(geoPoint.get(0));
                    existingDisaster.setLongitude(geoPoint.get(1));
                }
                existingDisaster.setDescription(disaster.getDescription());
                existingDisaster.setTags(disaster.getTags());
                existingDisaster.setAuditTrail("Updated by: " + principal.getName() + " at " + LocalDateTime.now());

                Disasters updatedDisaster = disastersService.saveDisaster(existingDisaster);
                return ResponseEntity.ok(updatedDisaster);
            }
            return null;
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDisasterById(@PathVariable Long id, Principal principal) {
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {

            Optional<Disasters> existingDisaster = disastersService.fetchDisasterById(id);
            if (existingDisaster.isPresent()) {
                disastersService.deleteDisasterById(id);
                return ResponseEntity.ok("disaster with id: " + id + " deleted successfully");
            }
            System.out.println("disaster with id: " + id + " not found still performed delete operation");
            return ResponseEntity.ok("disaster with id: " + id + " not found still performed delete operation");
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @GetMapping("/getCoordinates/{id}")
    public ResponseEntity<?> getCoordinatesById(@PathVariable Long id){
        Optional<Disasters> existingDisaster = disastersService.fetchDisasterById(id);
        if (existingDisaster.isPresent()) {
            Disasters disaster=existingDisaster.get();
            List<Double> coordinates=new ArrayList<Double>();
            coordinates.add(disaster.getLatitude());
            coordinates.add(disaster.getLongitude());
            return ResponseEntity.ok(coordinates);
        }
        return ResponseEntity.noContent().build();
    }

}
