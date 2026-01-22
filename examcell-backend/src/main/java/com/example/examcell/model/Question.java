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
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int marks;
    @Column(name = "courseoutcome")
    private int courseOutcome;
    @ManyToOne
    @JoinColumn(name = "coursecode")
    @JsonIgnoreProperties("questions")
    private Course course;

    @OneToMany(mappedBy = "question")
    @JsonIgnoreProperties("question")
    private List<Subquestion> subquestions;
}
