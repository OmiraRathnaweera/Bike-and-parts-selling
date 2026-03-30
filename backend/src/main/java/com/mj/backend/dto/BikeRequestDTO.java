package com.mj.backend.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikeRequestDTO {

    private String  name;
    private String  tagline;
    private String  category;
    private Long    price;
    private String  color;
    private String  image;

    private String  slug;
    private boolean stock;
    private String  specPower;
    private String  specTorque;
    private String  specEngine;

    private List<ColorRequest> colors;
    private List<GroupRequest>  groups;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColorRequest {
        private String hex;
        private String image;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupRequest {
        private String           title;
        private int              displayOrder;
        private List<RowRequest> rows;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RowRequest {
        private String label;
        private String value;
        private int    displayOrder;
    }
}