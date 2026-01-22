package com.example.examcell.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subquestion")
public class Subquestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int marks;
    private String content;
    @Column(name = "bloomslevel")
    private int bloomsLevel;
    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnoreProperties("subquestions")
    private Question question;
}
