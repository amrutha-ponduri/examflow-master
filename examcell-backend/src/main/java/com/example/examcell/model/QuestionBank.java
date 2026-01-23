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
public class QuestionBank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "reviewstatus")
    private String reviewStatus;

    // Foreign keys
    @ManyToOne
    @JoinColumn(name = "courseoffering")
    @JsonIgnoreProperties("questionbanks")
    private CourseOffering courseOffering;

    // bidirectional relationship
    @OneToMany(mappedBy = "questionBank")
    @JsonIgnoreProperties("questionBank")
    private List<Question> questions;

}
