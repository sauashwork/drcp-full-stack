package com.drcp.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name="resources")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Resources {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long disasterId;

    @NotNull
    private String name;

    @NotNull
    private String locationName;

    private Double latitude;
    private Double longitude;

    @NotNull
    private String type;

    private String ownerId;

    private String auditTrail;

    @Override
    public String toString() {
        return "Resources{" +
                "id=" + id +
                ", disasterId=" + disasterId +
                ", name='" + name + '\'' +
                ", locationName='" + locationName + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", type='" + type + '\'' +
                ", ownerId='" + ownerId + '\'' +
                ", auditTrail='" + auditTrail + '\'' +
                '}';
    }
}
