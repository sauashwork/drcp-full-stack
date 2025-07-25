package com.drcp.backend.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.drcp.backend.entity.Resources;
import com.drcp.backend.entity.Users;
import com.drcp.backend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.drcp.backend.service.ResourcesService;

@RestController
@RequestMapping("/resources")
public class ResourcesController {

    @Autowired
    private ResourcesService resourcesService;

    @Autowired
    private UsersService usersService;

    @GetMapping
    public ResponseEntity<List<Resources>> getAllResources(){
        List<Resources> resources= resourcesService.fetchAllResources();
        if(resources.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resources> getResourceById(@PathVariable Long id){
        Optional<Resources> existingResource=resourcesService.fetchResourceById(id);
        if(existingResource.isPresent()){
            return ResponseEntity.ok(existingResource.get());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byDisasterId/{disasterId}")
    public ResponseEntity<List<Resources>> findAllResourcesByDisasterId(@PathVariable Long disasterId){
        Optional<List<Resources>> existingResources=resourcesService.fetchAllResourcesByDisasterId(disasterId);
        if(existingResources.isPresent()){
            return ResponseEntity.ok(existingResources.get());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Resources resource, Principal principal){
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {
            resource.setId(null);
            resource.setDisasterId(resource.getDisasterId());
            resource.setName(resource.getName());
            resource.setLocationName(resource.getLocationName());
            resource.setType(resource.getType());
            resource.setOwnerId(principal.getName());
            resource.setAuditTrail("Created by: " + principal.getName() + " at " + LocalDateTime.now());
            List<Double> geoPoint = resourcesService.getLatLong(resource.getLocationName());
            if (geoPoint != null && geoPoint.size() == 2) {
                resource.setLatitude(geoPoint.get(0));
                resource.setLongitude(geoPoint.get(1));
            }
            Resources savedResource = resourcesService.saveResource(resource);
            return ResponseEntity.ok(savedResource);
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateResourceById(@PathVariable Long id, @RequestBody Resources resource, Principal principal){
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {
            Optional<Resources> existingResource = resourcesService.fetchResourceById(id);
            if (existingResource.isPresent()) {
                Resources updatedResource = existingResource.get();
                updatedResource.setDisasterId(resource.getDisasterId());
                updatedResource.setName(resource.getName());
                updatedResource.setLocationName(resource.getLocationName());
                updatedResource.setType(resource.getType());
                updatedResource.setAuditTrail("Updated by: " + principal.getName() + " at " + LocalDateTime.now());
                List<Double> geoPoint = resourcesService.getLatLong(resource.getLocationName());
                if (geoPoint != null && geoPoint.size() == 2) {
                    resource.setLatitude(geoPoint.get(0));
                    resource.setLongitude(geoPoint.get(1));
                }
                Resources savedResource = resourcesService.saveResource(updatedResource);
                return ResponseEntity.ok(savedResource);
            }
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResourceById(@PathVariable Long id, Principal principal){
        String loggedUsername = principal.getName();
        Users user = usersService.fetchUserByUsername(loggedUsername);
        if (user.getRole().equals("ADMIN") || user.getRole().equals("VOLUNTEER")) {
            Optional<Resources> existingResource = resourcesService.fetchResourceById(id);
            if (existingResource.isPresent()) {
                resourcesService.deleteResourceById(id);
                return ResponseEntity.ok("Deleted");
            }
            return ResponseEntity.ok("Deleted");
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Only admin and volunteer can perform this operation"));
    }

    @GetMapping("/getCoordinates/{id}")
    public ResponseEntity<?> getCoordinatesById(@PathVariable Long id){
        Optional<Resources> existingResource = resourcesService.fetchResourceById(id);
        if (existingResource.isPresent()) {
            Resources resource=existingResource.get();
            List<Double> coordinates=new ArrayList<Double>();
            coordinates.add(resource.getLatitude());
            coordinates.add(resource.getLongitude());
            return ResponseEntity.ok(coordinates);
        }
        return ResponseEntity.noContent().build();
    }
}
