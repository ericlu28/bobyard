package com.bobyard.comments.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.List;

import com.bobyard.comments.model.Comment;
import com.bobyard.comments.model.CommentRequest;
import com.bobyard.comments.repository.CommentRepository;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private static final String COMMENT_NOT_FOUND_MESSAGE = "Comment not found";

    @Autowired
    private CommentRepository commentRepository;

    /**
     * List all comments
     */
    @GetMapping
    public List<Comment> getComments() {
        return commentRepository.findAll();
    }

    /**
     * Add a comment, with new text (from “Admin” user), with the current time
     * @param commentRequest
     */
    @PostMapping
    public Comment addComment(@RequestBody CommentRequest commentRequest) {
        Comment comment = new Comment();
        comment.setText(commentRequest.getText());
        comment.setAuthor("Admin");
        comment.setDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        comment.setLikes(0);
        comment.setImage(commentRequest.getImage());
        return commentRepository.save(comment);
    }

    /**
     * Edit text of an existing comment
     * @param id
     * @param commentRequest
     */
    @PutMapping("/{id}")
    public Comment editCommentText(@PathVariable Long id, @RequestBody CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id)
        .orElseThrow(() -> new CommentNotFoundException(COMMENT_NOT_FOUND_MESSAGE));
        comment.setText(commentRequest.getText());
        comment.setDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return commentRepository.save(comment);
    }

    /**
     * Delete existing comments
     */
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id ) {
        Comment comment = commentRepository.findById(id)
        .orElseThrow(() -> new CommentNotFoundException(COMMENT_NOT_FOUND_MESSAGE));
        commentRepository.delete(comment);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class CommentNotFoundException extends RuntimeException {
        public CommentNotFoundException(String message) {
            super(message);
        }
    }
}