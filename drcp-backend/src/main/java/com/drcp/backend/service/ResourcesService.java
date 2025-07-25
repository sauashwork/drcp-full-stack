package com.drcp.backend.service;

import com.drcp.backend.entity.Resources;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.drcp.backend.repository.ResourcesRepository;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ResourcesService {

    @Autowired
    private ResourcesRepository resourcesRepository;

    @Autowired
    private RestTemplate restTemplate;

    public List<Resources> fetchAllResources(){
        return resourcesRepository.findAll();
    }

    public List<Double> getLatLong(String address){
        List<Double> geoPoint=tryGeocode(address);
        if (geoPoint == null && address.contains(",")) {
            String fallbackAddress = address.split(",")[0];
            geoPoint = tryGeocode(fallbackAddress);
        }
        return geoPoint;
    }

    public List<Double> tryGeocode(String address){
        try{
            String encodedAddress= URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://nominatim.openstreetmap.org/search?q=" + encodedAddress + "&format=json&limit=1";
            HttpHeaders headers=new HttpHeaders();
            headers.set("User-Agent", "Disaster Response Coordination Platform");
            HttpEntity<String> entity=new HttpEntity<>(headers);
            ResponseEntity<JsonNode> response=restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
            JsonNode body=response.getBody();
            if(body!=null && body.isArray() && !body.isEmpty()){
                JsonNode result=body.get(0);
                Double lat = result.get("lat").asDouble();
                Double lon = result.get("lon").asDouble();
                List<Double> geoPoint = new ArrayList<>();
                geoPoint.add(lat);
                geoPoint.add(lon);
                return geoPoint;
            }
        } catch(Exception e){
            System.out.println("Geocoding failed: " + e.getMessage());
        }
        return null;
    }

    public Resources saveResource(Resources resource){
        return resourcesRepository.save(resource);
    }

    public Optional<Resources> fetchResourceById(Long id) {
        return resourcesRepository.findById(id);
    }

    public void deleteResourceById(Long id) {
        resourcesRepository.deleteById(id);
    }

    public Optional<List<Resources>> fetchAllResourcesByDisasterId(Long disasterId) {
        return resourcesRepository.findByDisasterId(disasterId);
    }
}
