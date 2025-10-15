package com.macchain.infrastructure.repository;

import com.macchain.domain.entity.UserStatistics;
import com.macchain.domain.port.UserStatisticsRepository;
import com.macchain.infrastructure.entity.UserStatisticsJpaEntity;
import com.macchain.infrastructure.mapper.UserStatisticsMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class JpaUserStatisticsRepository implements UserStatisticsRepository {
    
    private final UserStatisticsJpaRepository userStatisticsJpaRepository;
    private final UserStatisticsMapper userStatisticsMapper;
    
    public JpaUserStatisticsRepository(UserStatisticsJpaRepository userStatisticsJpaRepository,
                                      UserStatisticsMapper userStatisticsMapper) {
        this.userStatisticsJpaRepository = userStatisticsJpaRepository;
        this.userStatisticsMapper = userStatisticsMapper;
    }
    
    @Override
    public Optional<UserStatistics> findByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate) {
        return userStatisticsJpaRepository.findByUserIdAndStatisticsDate(userId, statisticsDate)
                .map(userStatisticsMapper::toDomain);
    }
    
    @Override
    public List<UserStatistics> findByUserId(Long userId) {
        return userStatisticsJpaRepository.findByUserIdOrderByStatisticsDateDesc(userId)
                .stream()
                .map(userStatisticsMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserStatistics> findByUserIdAndMonth(Long userId, int year, int month) {
        return userStatisticsJpaRepository.findByUserIdAndMonth(userId, year, month)
                .stream()
                .map(userStatisticsMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserStatistics> findByUserIdAndYear(Long userId, int year) {
        return userStatisticsJpaRepository.findByUserIdAndYear(userId, year)
                .stream()
                .map(userStatisticsMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public UserStatistics save(UserStatistics userStatistics) {
        UserStatisticsJpaEntity jpaEntity = userStatisticsMapper.toJpaEntity(userStatistics);
        UserStatisticsJpaEntity savedEntity = userStatisticsJpaRepository.save(jpaEntity);
        return userStatisticsMapper.toDomain(savedEntity);
    }
    
    @Override
    public void deleteByUserIdAndStatisticsDate(Long userId, LocalDate statisticsDate) {
        userStatisticsJpaRepository.deleteByUserIdAndStatisticsDate(userId, statisticsDate);
    }
}

