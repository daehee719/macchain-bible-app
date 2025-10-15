package com.macchain.infrastructure.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.macchain.domain.valueobject.ReadingProgress;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

/**
 * ReadingProgress 리스트를 JSON으로 변환하는 JPA 컨버터
 */
@Converter
public class ReadingProgressListConverter implements AttributeConverter<List<ReadingProgress>, String> {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public String convertToDatabaseColumn(List<ReadingProgress> readings) {
        if (readings == null || readings.isEmpty()) {
            return "[]";
        }
        
        try {
            return objectMapper.writeValueAsString(readings);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert ReadingProgress list to JSON", e);
        }
    }
    
    @Override
    public List<ReadingProgress> convertToEntityAttribute(String json) {
        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }
        
        try {
            return objectMapper.readValue(json, new TypeReference<List<ReadingProgress>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to ReadingProgress list", e);
        }
    }
}

