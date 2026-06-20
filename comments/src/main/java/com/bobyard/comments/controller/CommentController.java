package com.bobyard.comments.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import com.bobyard.comments.model.Comment;

@RestController
public class CommentController {
    @GetMapping("/comments")
    public List<Comment> getComments() {
        return null;
    }
}