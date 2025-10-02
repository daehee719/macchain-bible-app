package com.macchain.infrastructure.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.macchain.domain.entity.UserStatistics;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;

@Converter
public class DailyProgressListConverter implements AttributeConverter<List<UserStatistics.DailyProgress>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    public String convertToDatabaseColumn(List<UserStatistics.DailyProgress> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting DailyProgress list to JSON", e);
        }
    }

    @Override
    public List<UserStatistics.DailyProgress> convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return objectMapper.readValue(dbData, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, UserStatistics.DailyProgress.class));
        } catch (IOException e) {
            throw new IllegalArgumentException("Error converting JSON to DailyProgress list", e);
        }
    }
}

