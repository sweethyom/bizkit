package com.ssafy.s12p21d206.achu.storage.db.core.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Convert;
import java.util.List;

@Convert
public class ImgUrlListJsonConverter implements AttributeConverter<List<String>, String> {
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(List<String> attribute) {
    try {
      return objectMapper.writeValueAsString(attribute);
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert list to JSON", e);
    }
  }

  @Override
  public List<String> convertToEntityAttribute(String dbData) {
    try {
      if (dbData != null && dbData.startsWith("\"[") && dbData.endsWith("]\"")) {
        dbData = objectMapper.readValue(dbData, String.class);
      }
      return objectMapper.readValue(dbData, new TypeReference<List<String>>() {});
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to convert JSON to list", e);
    }
  }
}
