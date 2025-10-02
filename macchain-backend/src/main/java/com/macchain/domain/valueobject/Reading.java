package com.macchain.domain.valueobject;

/**
 * 읽기 항목 값 객체 (Value Object)
 * 불변 객체로 설계
 */
public class Reading {
    private final String book;
    private final Integer chapter;
    private final ReadingType type;
    
    // 모든 필드 생성자
    public Reading(String book, Integer chapter, ReadingType type) {
        this.book = book;
        this.chapter = chapter;
        this.type = type;
    }
    
    // Getter 메서드들 (불변 객체이므로 setter 없음)
    public String getBook() { return book; }
    public Integer getChapter() { return chapter; }
    public ReadingType getType() { return type; }
    
    // equals와 hashCode 메서드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reading reading = (Reading) o;
        return java.util.Objects.equals(book, reading.book) &&
               java.util.Objects.equals(chapter, reading.chapter) &&
               type == reading.type;
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(book, chapter, type);
    }
    
    @Override
    public String toString() {
        return "Reading{" +
                "book='" + book + '\'' +
                ", chapter=" + chapter +
                ", type=" + type +
                '}';
    }
    
    public Reading(String book, Integer chapter) {
        this.book = book;
        this.chapter = chapter;
        this.type = determineType(book);
    }
    
    private ReadingType determineType(String book) {
        // 구약 성경 책들
        String[] oldTestamentBooks = {
            "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
            "joshua", "judges", "ruth", "1samuel", "2samuel", "1kings", "2kings",
            "1chronicles", "2chronicles", "ezra", "nehemiah", "esther",
            "job", "psalms", "proverbs", "ecclesiastes", "songofsongs",
            "isaiah", "jeremiah", "lamentations", "ezekiel", "daniel",
            "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum",
            "habakkuk", "zephaniah", "haggai", "zechariah", "malachi"
        };
        
        // 신약 성경 책들
        String[] newTestamentBooks = {
            "matthew", "mark", "luke", "john", "acts", "romans", "1corinthians",
            "2corinthians", "galatians", "ephesians", "philippians", "colossians",
            "1thessalonians", "2thessalonians", "1timothy", "2timothy", "titus",
            "philemon", "hebrews", "james", "1peter", "2peter", "1john", "2john",
            "3john", "jude", "revelation"
        };
        
        for (String otBook : oldTestamentBooks) {
            if (otBook.equalsIgnoreCase(book)) {
                return ReadingType.OLD_TESTAMENT;
            }
        }
        
        for (String ntBook : newTestamentBooks) {
            if (ntBook.equalsIgnoreCase(book)) {
                return ReadingType.NEW_TESTAMENT;
            }
        }
        
        return ReadingType.UNKNOWN;
    }
    
    public boolean isOldTestament() {
        return type == ReadingType.OLD_TESTAMENT;
    }
    
    public boolean isNewTestament() {
        return type == ReadingType.NEW_TESTAMENT;
    }
    
    public enum ReadingType {
        OLD_TESTAMENT, NEW_TESTAMENT, UNKNOWN
    }
}
