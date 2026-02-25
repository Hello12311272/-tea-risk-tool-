# Product Requirements Document (PRD)
## TeaInsight Customer Churn Risk Assessor

**Version:** 1.0  
**Date:** 2026-02-25  
**Status:** Approved  
**Product Owner:** TeaInsight Analytics Team

---

## 1. Executive Summary

### 1.1 产品愿景
茶言觀色·客戶流失風險評估器是一个基于网页的分析工具，旨在帮助手摇茶饮店的店长、管理阶层、营销与营运人员识别有流失风险的顾客。该工具使用机器学习聚类技术，提供可操作的见解和建议，以保留有价值的顾客并改善业务绩效。

### 1.2 问题陈述
手摇茶饮店面临重大的顾客保留挑战：
- 难以识别哪些顾客可能停止光顾
- 缺乏数据驱动的个性化顾客互动洞察
- 顾客行为模式的手动分析效率低下
- 没有系统的顾客细分和风险评估方法

### 1.3 解决方案概述
一个响应式网页应用程序，具有以下功能：
- 使用K-Means聚类模型（K=4）基于4个关键特征分析顾客数据
- 提供实时的流失风险评估和可视化仪表板
- 为每个顾客细分提供可操作的建议
- 支持单个顾客分析和批量CSV处理
- 具备多语言支持（繁体中文、简体中文、英文）

---

## 2. Product Overview

### 2.1 Core Features
1. **Single Customer Analysis**: Input individual customer data for instant churn risk assessment
2. **Batch CSV Processing**: Upload CSV files for bulk customer analysis
3. **Multi-language Interface**: Support for Traditional Chinese, Simplified Chinese, and English
4. **Visual Analytics Dashboard**: Interactive charts and graphs for data visualization
5. **Actionable Recommendations**: Specific retention strategies for each customer segment
6. **Export Capabilities**: Download analysis results and templates

### 2.2 目标用户
- **主要用户**: 手摇茶饮店的店长、管理阶层
- **次要用户**: 行销与营运人员
- **扩展用户**: 餐饮行业的业务分析师

### 2.3 Key Metrics
- Customer churn rate reduction
- Customer lifetime value increase
- User engagement (daily active users)
- Analysis accuracy (model performance)

---

## 3. Technical Architecture

### 3.1 Current Implementation
**Frontend Stack:**
- HTML5 with semantic markup
- Tailwind CSS for responsive design
- Chart.js for data visualization
- PapaParse for CSV processing
- Vanilla JavaScript for application logic

**File Structure:**
```
tea-risk-tool/
├── index.html          # Main application interface
├── app.js              # Core business logic and algorithms
├── styles.css          # Custom styling and animations
└── (future) data/      # Sample datasets and templates
```

### 3.2 Data Model
**Customer Features:**
1. **Monthly Visits (freq)**: Number of visits per month (0-50)
2. **Average Spending (amount)**: Average transaction amount (0-500)
3. **Days Since Last Visit (days)**: Recency metric (0-365)
4. **Satisfaction Score (sat)**: Customer satisfaction rating (1-5)

**Clustering Model:**
- **Algorithm**: K-Means clustering with K=4
- **Features**: 4 standardized customer metrics
- **Clusters**:
  - **群体 0：高滿意沉睡客** (31% 流失)
    - 月消費頻率：中等（8.64次）
    - 單次消費：高（72.09元）
    - 最近消費：很久沒來（72.36天）
    - 滿意度：高（4.18分）
    - 特征：曾經的高價值顧客但已許久未消費
    
  - **群体 1：核心價值客** (19% 流失)
    - 月消費頻率：最高（12.28次）
    - 單次消費：最高（93.44元）
    - 最近消費：較近（26.93天）
    - 滿意度：中等（3.47分）
    - 特征：高消費高頻次，是品牌的核心資產
    
  - **群体 2：穩定客** (10% 流失)
    - 月消費頻率：中等（6.82次）
    - 單次消費：中等偏低（59.70元）
    - 最近消費：較近（24.34天）
    - 滿意度：高（4.21分）
    - 特征：忠誠度高，流失風險小
    
  - **群体 3：高風險流失客** (36% 流失)
    - 月消費頻率：中等偏低（6.45次）
    - 單次消費：中等偏高（80.16元）
    - 最近消費：較久沒來（56.62天）
    - 滿意度：低（2.35分）
    - 特征：滿意度低且久未消費，流失風險最高

### 3.3 Algorithms
**Distance Calculation:**
```javascript
function calculateDistance(input, center) {
    const scale = { freq: 15, amount: 50, days: 90, sat: 2 };
    const diffFreq = Math.pow((input.freq - center.freq) / scale.freq, 2);
    const diffAmount = Math.pow((input.amount - center.amount) / scale.amount, 2);
    const diffDays = Math.pow((input.days - center.days) / scale.days, 2);
    const diffSat = Math.pow((input.sat - center.sat) / scale.sat, 2);
    return Math.sqrt(diffFreq + diffAmount + diffDays + diffSat);
}
```

**Classification Logic:**
- Calculate Euclidean distance to each cluster center
- Assign customer to nearest cluster
- Return cluster properties and churn risk percentage

---

## 4. User Experience & Interface

### 4.1 用户流程
1. **进入页面**: 用户访问主仪表板
2. **语言选择**: 选择偏好的界面语言（繁中/简中/英文）
3. **数据输入**: 手动输入顾客数据或上传CSV文件
4. **分析处理**: 系统根据K-Means分群模型判断顾客类型与流失机率
5. **结果查看**: 用户查看顾客分群结果、流失风险等级与经营建议
6. **行动执行**: 用户根据系统建议实施顾客保留策略

### 4.2 交互逻辑
使用者输入顾客的基本资料与消费行为资料，包括：
- 月消费频率（月消费次数）
- 平均消费金额（单次消费）
- 距离最后消费天数（最近消费）
- 顾客满意度评分

系统会依据K-Means分群模型判断这位顾客的类型与流失机率，并显示对应的风险等级与经营建议。

### 4.3 页面结构
单页式操作界面，包含以下部分：
1. **顶部区域**: 工具标题「茶言觀色·客戶流失風險評估器」与简介
2. **中间区域**: 顾客资料输入栏位（表单）
3. **下方区域**: 即时显示顾客分群结果、流失风险与对应的行动建议
4. **辅助区域**: 批量分析功能（CSV上传/下载模板）
5. **说明区域**: K-Means四群体定义说明

### 4.4 设计风格
- **整体风格**: 简洁专业、易阅读，营造舒适温暖的视觉体验
- **色彩方案**: 使用茶绿色（#047857）作为主色调，搭配浅米色（#f9f7f2）作为背景
- **排版设计**: 卡片式排版，每个功能区域用圆角大卡片分隔，阴影适中，层次分明
- **字体选择**: Noto Sans TC（繁体中文/简体中文）和Inter（英文），确保跨语言阅读一致性
- **交互元素**: 所有按钮、图标都经过精心设计，让店长能够快速理解顾客状态
- **响应式设计**: 移动优先，支持桌面、平板和手机设备

---

## 5. Functional Requirements

### 5.1 Core Functionality
**FR-001: Single Customer Analysis**
- Users can input 4 customer metrics via form
- System validates input ranges and formats
- Real-time calculation and display of results
- Visual feedback for invalid inputs

**FR-002: Batch Processing**
- CSV file upload with validation
- Template download with sample data
- Bulk analysis with summary statistics
- Results table with pagination

**FR-003: Multi-language Support**
- Dynamic language switching without page reload
- Consistent terminology across languages
- Right-to-left text support if needed
- Language persistence (future enhancement)

**FR-004: Data Visualization**
- Doughnut gauge for churn risk percentage
- Line chart for historical spending trends
- Radar chart for multi-dimensional comparison
- Responsive charts that adapt to screen size

### 5.2 User Interface Requirements
**FR-005: Responsive Design**
- Mobile-friendly layout (320px+)
- Tablet optimization (768px+)
- Desktop experience (1024px+)
- Touch-friendly controls

**FR-006: Accessibility**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1)
- Focus indicators for interactive elements

**FR-007: Performance**
- Page load under 3 seconds
- Chart rendering under 1 second
- CSV processing under 5 seconds for 1000 records
- Smooth animations (60fps)

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Response Time**: < 2 seconds for single analysis
- **Throughput**: Support 100 concurrent users
- **Availability**: 99.5% uptime
- **Data Limits**: CSV files up to 10MB, 10,000 records

### 6.2 Security
- **Data Privacy**: No customer data stored on server
- **Client-side Processing**: All analysis happens in browser
- **Input Sanitization**: Protection against XSS attacks
- **CSV Validation**: Safe parsing of uploaded files

### 6.3 Compatibility
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Devices**: Desktop, tablet, mobile
- **Operating Systems**: Windows, macOS, iOS, Android
- **Network**: Works offline after initial load

### 6.4 Maintainability
- **Code Quality**: Modular JavaScript with clear separation
- **Documentation**: Comprehensive comments and README
- **Testing**: Unit tests for core algorithms
- **Deployment**: Static hosting compatibility

---

## 7. Future Enhancements (Roadmap)

### 7.1 Phase 1 (Q2 2026)
- User authentication and profiles
- Save analysis history
- Export results as PDF/Excel
- Email report sharing

### 7.2 Phase 2 (Q3 2026)
- Advanced machine learning models
- Real-time data integration with POS systems
- Predictive analytics for future churn
- A/B testing for recommendation effectiveness

### 7.3 Phase 3 (Q4 2026)
- API for third-party integration
- Mobile application (React Native)
- Advanced segmentation (RFM analysis)
- Competitor benchmarking

### 7.4 Phase 4 (Q1 2027)
- AI-powered recommendation engine
- Natural language insights generation
- Integration with marketing automation
- Advanced reporting and dashboards

---

## 8. Success Criteria

### 8.1 Business Metrics
- **Adoption**: 100+ active users within 3 months
- **Retention**: 80% of users return weekly
- **Impact**: 15% reduction in customer churn for users
- **Satisfaction**: 4.5/5 user satisfaction rating

### 8.2 Technical Metrics
- **Performance**: 95th percentile load time < 3s
- **Reliability**: 99.5% uptime
- **Accuracy**: 85%+ churn prediction accuracy
- **Scalability**: Support 500 concurrent users

### 8.3 User Metrics
- **Engagement**: Average session duration > 5 minutes
- **Feature Usage**: 70%+ users utilize batch processing
- **Feedback**: Positive sentiment in user reviews
- **Referrals**: 20% growth from word-of-mouth

---

## 9. Constraints & Assumptions

### 9.1 Constraints
- Client-side only processing (no backend server)
- Limited to 4 customer features for clustering
- Static cluster centers (pre-calculated from historical data)
- No persistent data storage in current version

### 9.2 Assumptions
- Users have basic computer literacy
- Customer data is available in specified format
- Tea shop owners understand basic analytics concepts
- Internet connectivity is available for initial load

### 9.3 Dependencies
- Chart.js library for visualizations
- Tailwind CSS CDN for styling
- PapaParse for CSV processing
- Modern browser with JavaScript enabled

---

## 10. Glossary

- **Churn**: Customer stopping purchases or visits
- **K-Means**: Unsupervised machine learning algorithm for clustering
- **RFM**: Recency, Frequency, Monetary value analysis
- **Cluster**: Group of customers with similar characteristics
- **Standardization**: Scaling features to comparable ranges
- **POS**: Point of Sale system
- **WCAG**: Web Content Accessibility Guidelines

---

## 11. Appendices

### 11.1 群体定义
| 群体 | 名称 | 流失比例 | 特征描述 | 主要行动建议 |
|------|------|----------|----------|--------------|
| 0 | 高滿意沉睡客 | 31% | 月消費頻率中等（8.64），單次消費高（72.09），最近消費很久沒來（72.36天），滿意度高（4.18）。曾經的高價值顧客但已許久未消費。 | 發送「久未見面」專屬優惠，推薦季節新品，簡訊問候+贈送小配料 |
| 1 | 核心價值客 | 19% | 月消費頻率最高（12.28），單次消費最高（93.44），最近消費較近（26.93天），滿意度中等（3.47）。高消費高頻次，是品牌的核心資產。 | 提供新品優先試喝權，邀請參與品牌活動，設定專屬客服 |
| 2 | 穩定客 | 10% | 月消費頻率中等（6.82），單次消費中等偏低（59.70），最近消費較近（24.34天），滿意度高（4.21）。忠誠度高，流失風險小。 | 邀請升級VIP會員，提供生日禮遇，鼓勵分享體驗 |
| 3 | 高風險流失客 | 36% | 月消費頻率中等偏低（6.45），單次消費中等偏高（80.16），最近消費較久沒來（56.62天），滿意度低（2.35）。滿意度低且久未消費，流失風險最高。 | 主動回訪了解不滿意原因，提供真誠補償體驗，改善服務流程後邀請再次體驗 |

### 11.2 CSV Template Structure
```csv
customer_id,monthly_visits,avg_spending,days_since_last_visit,satisfaction
C001,8.42,73.14,70.52,4.23
C002,7.1,59.04,22.29,4.24
C003,12.40,93.98,26.72,3.30
C004,6.29,82.58,54.87,2.30
```

### 11.3 Risk Level Classification
- **Low Risk**: < 10% churn probability (🟢)
- **Medium Risk**: 10-20% churn probability (🟡)
- **Medium-High Risk**: 20-30% churn probability (🟠)
- **High Risk**: ≥ 30% churn probability (🔴)

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-25 | Product Team | Initial PRD based on existing implementation |
| 0.9 | 2026-02-20 | Dev Team | Technical specifications added |
| 0.8 | 2026-02-15 | UX Team | User experience requirements finalized |
| 0.5 | 2026-02-10 | Business Team | Initial requirements gathering |

---

**Approval Signatures:**

Product Owner: ___________________ Date: ______________

Technical Lead: ___________________ Date: ______________

UX Designer: _____________________ Date: ______________

Business Stakeholder: _____________ Date: ______________