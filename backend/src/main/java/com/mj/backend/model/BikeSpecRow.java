package com.mj.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bike_spec_rows")
@Data @NoArgsConstructor @AllArgsConstructor
public class BikeSpecRow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private BikeSpecGroup group;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(name = "display_order")
    private int displayOrder = 0;
}