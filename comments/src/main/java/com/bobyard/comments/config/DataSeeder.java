package com.bobyard.comments.config;

import com.bobyard.comments.model.Comment;
import com.bobyard.comments.repository.CommentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Loads comments.json into the database on startup when the table is
 * empty.
 */

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String COMMENTS_JSON_FILE = "comments.json";
    private final CommentRepository commentRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(CommentRepository commentRepository, ObjectMapper objectMapper) {
        this.commentRepository = commentRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (commentRepository.count() > 0) {
            return;
        }

        try (InputStream is = new ClassPathResource(COMMENTS_JSON_FILE).getInputStream()) {
            JsonNode root = objectMapper.readTree(is);
            JsonNode commentsNode = root.get("comments");

            List<Comment> comments = new ArrayList<>();
            for (JsonNode node : commentsNode) {
                Comment comment = new Comment();
                comment.setAuthor(node.get("author").asText());
                comment.setText(node.get("text").asText());
                comment.setDate(node.get("date").asText());
                comment.setLikes(node.get("likes").asInt());
                comment.setImage(node.get("image").asText());
                comments.add(comment);
            }
            commentRepository.saveAll(comments);
        }
    }
}
