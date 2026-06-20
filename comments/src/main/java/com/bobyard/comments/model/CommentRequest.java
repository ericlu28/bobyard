package com.bobyard.comments.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private String text;
    private String image;
}