package com.example.examcell.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "course")
public class Course {
    @Id
    private String courseCode;
    @Column(name = "title")
    private String courseTitle;
    private double credits;
    @OneToMany(mappedBy = "course")
    @JsonIgnoreProperties("course")
    private List<Question> questions;
}
