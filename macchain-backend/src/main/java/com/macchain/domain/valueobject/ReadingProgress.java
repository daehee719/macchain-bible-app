package com.macchain.domain.valueobject;

/**
 * 읽기 진행률 값 객체
 */
public class ReadingProgress {
    
    private final String book;
    private final int chapter;
    private final boolean completed;
    
    public ReadingProgress(String book, int chapter, boolean completed) {
        this.book = book;
        this.chapter = chapter;
        this.completed = completed;
    }
    
    public String getBook() {
        return book;
    }
    
    public int getChapter() {
        return chapter;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        ReadingProgress that = (ReadingProgress) obj;
        return chapter == that.chapter && 
               completed == that.completed && 
               book.equals(that.book);
    }
    
    @Override
    public int hashCode() {
        int result = book.hashCode();
        result = 31 * result + chapter;
        result = 31 * result + (completed ? 1 : 0);
        return result;
    }
    
    @Override
    public String toString() {
        return "ReadingProgress{" +
                "book='" + book + '\'' +
                ", chapter=" + chapter +
                ", completed=" + completed +
                '}';
    }
}

