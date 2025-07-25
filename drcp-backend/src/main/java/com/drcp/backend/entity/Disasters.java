package com.drcp.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name="disasters")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Disasters {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String locationName;

    private Double latitude;

    private Double longitude;

    @NotNull
    private String description;

    @NotNull
    private String tags;

    private String ownerId;

    private LocalDateTime createdAt;

    private String auditTrail;

    @Override
    public String toString() {
        return "Disasters{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", locationName='" + locationName + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", description='" + description + '\'' +
                ", tags='" + tags + '\'' +
                ", ownerId='" + ownerId + '\'' +
                ", createdAt=" + createdAt +
                ", auditTrail='" + auditTrail + '\'' +
                '}';
    }
}
