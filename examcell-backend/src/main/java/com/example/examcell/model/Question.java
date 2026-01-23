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
public class Question {
    @Id
    private int id;
    private int marks;

    // Foreign key
    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
    @ManyToOne
    @JoinColumn(name = "questionbank_id")
    @JsonIgnoreProperties("questions")
    private QuestionBank questionBank;

    // bidirectional
    @OneToMany(mappedBy = "question")
    @JsonIgnoreProperties("question")
    private List<Subquestion> subquestions;
}
