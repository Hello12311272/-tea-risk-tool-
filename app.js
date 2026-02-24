// 茶言觀色客戶流失風險評估器 - 主要邏輯

// ==================== 全局變數 ====================
const clusterCenters = {
    0: { 
        nameZh: "高滿意沉睡客", nameCn: "高满意沉睡客", nameEn: "High-Satisfaction Dormant",
        freq: 8.42, amount: 73.14, days: 70.52, sat: 4.23, 
        churn: 33, 
        color: "#f59e0b",
        insightZh: "滿意度高但許久未到，可能被其他品牌搶走，或近期生活型態改變。",
        insightCn: "满意度高但许久未到，可能被其他品牌抢走，或近期生活型态改变。",
        insightEn: "High satisfaction but long absence - may have switched to competitors.",
        actionsZh: [
            "發送「久未見面」專屬優惠，例如第 2 杯半價",
            "推薦季節新品，利用高滿意度吸引回購",
            "可考慮簡訊問候 + 贈送小配料"
        ],
        actionsCn: [
            "发送「久未见面」专属优惠，例如第 2 杯半价",
            "推荐季节新品，利用高满意度吸引回购",
            "可考虑短信问候 + 赠送小配料"
        ],
        actionsEn: [
            "Send 'Long time no see' exclusive offer (2nd cup half price)",
            "Recommend seasonal new products",
            "Consider SMS greeting with small gift"
        ],
        goalZh: "提升到店頻率，轉為「穩定客」",
        goalCn: "提升到店频率，转为「稳定客」",
        goalEn: "Increase visit frequency, convert to 'Stable Customer'"
    },
    1: { 
        nameZh: "穩定客", nameCn: "稳定客", nameEn: "Stable Customers",
        freq: 7.1, amount: 59.04, days: 22.29, sat: 4.24, 
        churn: 6, 
        color: "#10b981",
        insightZh: "忠誠度高、流失風險小，是門店的穩定基礎客群。",
        insightCn: "忠诚度高、流失风险小，是门店的稳定基础客群。",
        insightEn: "High loyalty, low churn risk - stable customer base.",
        actionsZh: [
            "邀請升級 VIP 會員，享受專屬折扣",
            "提供生日禮遇與節日問候",
            "鼓勵分享體驗，擴大口碑傳播"
        ],
        actionsCn: [
            "邀请升级 VIP 会员，享受专属折扣",
            "提供生日礼遇与节日问候",
            "鼓励分享体验，扩大口碑传播"
        ],
        actionsEn: [
            "Invite to upgrade VIP membership",
            "Provide birthday treats and holiday greetings",
            "Encourage sharing experiences"
        ],
        goalZh: "維持關係，提升客單價",
        goalCn: "维持关系，提升客单价",
        goalEn: "Maintain relationship, increase order value"
    },
    2: { 
        nameZh: "核心價值客", nameCn: "核心价值客", nameEn: "Core Value Customers",
        freq: 12.40, amount: 93.98, days: 26.72, sat: 3.30, 
        churn: 22, 
        color: "#3b82f6",
        insightZh: "高消費高頻次，是品牌的核心資產，需重點維護。",
        insightCn: "高消费高频次，是品牌的核心资产，需重点维护。",
        insightEn: "High spending and frequency - core brand assets.",
        actionsZh: [
            "提供新品優先試喝權",
            "邀請參與品牌活動或產品研發",
            "設定專屬客服，提升服務體驗"
        ],
        actionsCn: [
            "提供新品优先试喝权",
            "邀请参与品牌活动或产品研发",
            "设置专属客服，提升服务体验"
        ],
        actionsEn: [
            "Priority tasting of new products",
            "Invite to brand events",
            "Dedicated customer service"
        ],
        goalZh: "提升滿意度，防止被競爭對手挖角",
        goalCn: "提升满意度，防止被竞争对手挖角",
        goalEn: "Improve satisfaction, prevent competitor poaching"
    },
    3: { 
        nameZh: "高風險流失客", nameCn: "高风险流失客", nameEn: "High-Risk Churn",
        freq: 6.29, amount: 82.58, days: 54.87, sat: 2.30, 
        churn: 35, 
        color: "#ef4444",
        insightZh: "滿意度低且久未消費，流失風險最高，需緊急介入挽回。",
        insightCn: "满意度低且久未消费，流失风险最高，需紧急介入挽回。",
        insightEn: "Low satisfaction, long absence - urgent intervention needed.",
        actionsZh: [
            "主動回訪了解不滿意原因",
            "提供真誠補償體驗（免費升級/贈品）",
            "改善服務流程後邀請再次體驗"
        ],
        actionsCn: [
            "主动回访了解不满意原因",
            "提供真诚补偿体验（免费升级/赠品）",
            "改善服务流程后邀请再次体验"
        ],
        actionsEn: [
            "Proactively follow up on dissatisfaction",
            "Provide sincere compensation (free upgrade/gift)",
            "Improve service, invite to try again"
        ],
        goalZh: "緊急挽回，解決服務問題",
        goalCn: "紧急挽回，解决服务问题",
        goalEn: "Urgent recovery, resolve service issues"
    }
};

let gaugeChartInst = null;
let trendChartInst = null;
let radarChartInst = null;
let csvData = [];
let lastResult = null;
let currentLang = 'zh';

// ==================== 工具函數 ====================
function safeSetText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

function showLoading(message = '處理中...') {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// ==================== 語言切換 ====================
function switchLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.getAttribute('data-lang') === lang) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    
    document.getElementById('bodyElement').className = 'text-gray-800';
    if (lang === 'en') {
        document.getElementById('bodyElement').classList.add('lang-en');
    }
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-green-700', 'text-white', 'border-green-700');
        btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
    });
    
    if (lang === 'zh') {
        document.getElementById('langZhBtn').classList.add('active', 'bg-green-700', 'text-white', 'border-green-700');
        document.getElementById('pageTitle').innerText = '茶言觀色 · 客戶流失風險評估器';
    } else if (lang === 'cn') {
        document.getElementById('langCnBtn').classList.add('active', 'bg-green-700', 'text-white', 'border-green-700');
        document.getElementById('pageTitle').innerText = '茶言观色 · 客户流失风险评估器';
    } else {
        document.getElementById('langEnBtn').classList.add('active', 'bg-green-700', 'text-white', 'border-green-700');
        document.getElementById('pageTitle').innerText = 'TeaInsight · Customer Churn Risk Assessor';
    }
    
    if (lastResult) {
        updateUIText(lastResult);
    }
}

// ==================== 核心計算函數 ====================
function calculateDistance(input, center) {
    const scale = { freq: 15, amount: 50, days: 90, sat: 2 };
    const diffFreq = Math.pow((input.freq - center.freq) / scale.freq, 2);
    const diffAmount = Math.pow((input.amount - center.amount) / scale.amount, 2);
    const diffDays = Math.pow((input.days - center.days) / scale.days, 2);
    const diffSat = Math.pow((input.sat - center.sat) / scale.sat, 2);
    return Math.sqrt(diffFreq + diffAmount + diffDays + diffSat);
}

function classifyCustomer(freq, amount, days, sat) {
    const input = { freq, amount, days, sat };
    let distances = {};
    for (let clusterId in clusterCenters) {
        distances[clusterId] = calculateDistance(input, clusterCenters[clusterId]);
    }
    let closestCluster = Object.keys(distances).reduce((a, b) => 
        distances[a] < distances[b] ? a : b
    );
    return {
        clusterId: parseInt(closestCluster),
        ...clusterCenters[closestCluster],
        distance: distances[closestCluster]
    };
}

// ==================== 表單處理 ====================
function fillExample() {
    document.getElementById('freq').value = 7.1;
    document.getElementById('amount').value = 59.04;
    document.getElementById('days').value = 22.29;
    document.getElementById('satisfaction').value = 4.24;
    evaluateCustomer();
}

function validateForm() {
    const freq = parseFloat(document.getElementById('freq').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const days = parseFloat(document.getElementById('days').value);
    const sat = parseFloat(document.getElementById('satisfaction').value);
    
    let isValid = true;
    
    if (isNaN(freq) || freq < 0 || freq > 50) { 
        document.getElementById('freqError').classList.remove('hidden'); 
        isValid = false; 
    } else { 
        document.getElementById('freqError').classList.add('hidden'); 
    }
    
    if (isNaN(amount) || amount < 0 || amount > 500) { 
        document.getElementById('amountError').classList.remove('hidden'); 
        isValid = false; 
    } else { 
        document.getElementById('amountError').classList.add('hidden'); 
    }
    
    if (isNaN(days) || days < 0 || days > 365) { 
        document.getElementById('daysError').classList.remove('hidden'); 
        isValid = false; 
    } else { 
        document.getElementById('daysError').classList.add('hidden'); 
    }
    
    if (isNaN(sat) || sat < 1 || sat > 5) { 
        document.getElementById('satError').classList.remove('hidden'); 
        isValid = false; 
    } else { 
        document.getElementById('satError').classList.add('hidden'); 
    }
    
    return { isValid, freq, amount, days, sat };
}

function evaluateCustomer() {
    const validation = validateForm();
    if (!validation.isValid) return;
    
    const { freq, amount, days, sat } = validation;
    
    showLoading(currentLang === 'zh' ? '分析中...' : 
                currentLang === 'cn' ? '分析中...' : 
                'Analyzing...');
    
    setTimeout(() => {
        const result = classifyCustomer(freq, amount, days, sat);
        lastResult = result;
        
        updateResultUI(result, { freq, amount, days, sat });
        renderGauge(result.churn, result.color);
        renderTrendChart(freq, days);
        renderRadarChart(freq, amount, days, sat);
        
        hideLoading();
        showToast(
            currentLang === 'zh' ? '分析完成！' : 
            currentLang === 'cn' ? '分析完成！' : 
            'Analysis complete!',
            'success'
        );
    }, 800);
}

// ==================== UI 更新函數 ====================
function updateResultUI(result, input) {
    let name, insight, actions, goal;
    
    if (currentLang === 'en') {
        name = result.nameEn;
        insight = result.insightEn;
        actions = result.actionsEn;
        goal = result.goalEn;
    } else if (currentLang === 'cn') {
        name = result.nameCn;
        insight = result.insightCn;
        actions = result.actionsCn;
        goal = result.goalCn;
    } else {
        name = result.nameZh;
        insight = result.insightZh;
        actions = result.actionsZh;
        goal = result.goalZh;
    }
    
    safeSetText('clusterBadge', (currentLang === 'zh' ? '群組 ' : currentLang === 'cn' ? '群体 ' : 'Cluster ') + result.clusterId);
    safeSetText('clusterName', name);
    safeSetText('riskBadge', `📉 ${currentLang === 'zh' ? '流失比例' : currentLang === 'cn' ? '流失比例' : 'Churn Rate'} ${result.churn}%`);
    
    if (currentLang === 'en') {
        document.getElementById('insightText').classList.remove('active');
        document.getElementById('insightTextCn').classList.remove('active');
        document.getElementById('insightTextEn').classList.add('active');
        safeSetText('insightTextEn', insight);
    } else if (currentLang === 'cn') {
        document.getElementById('insightText').classList.remove('active');
        document.getElementById('insightTextEn').classList.remove('active');
        document.getElementById('insightTextCn').classList.add('active');
        safeSetText('insightTextCn', insight);
    } else {
        document.getElementById('insightText').classList.add('active');
        document.getElementById('insightTextEn').classList.remove('active');
        document.getElementById('insightTextCn').classList.remove('active');
        safeSetText('insightText', insight);
    }
    
    safeSetText('resFreq', input.freq.toFixed(2));
    safeSetText('resAmount', input.amount.toFixed(2));
    safeSetText('resDays', input.days.toFixed(2));
    safeSetText('resSat', input.sat.toFixed(2));
    safeSetText('goalText', `🎯 ${currentLang === 'zh' ? '目標：' : currentLang === 'cn' ? '目标：' : 'Goal: '}${goal}`);
    
    const actionList = document.getElementById('actionList');
    actionList.innerHTML = '';
    actions.forEach((action, index) => {
        const li = document.createElement('li');
        li.className = "flex items-start";
        li.innerHTML = `<span class="mr-2 text-green-600 font-bold">${index + 1}.</span> ${action}`;
        actionList.appendChild(li);
    });
    
    safeSetText('timestamp', new Date().toLocaleTimeString(
        currentLang === 'zh' ? 'zh-TW' : currentLang === 'cn' ? 'zh-CN' : 'en-US', 
        {hour: '2-digit', minute:'2-digit'}
    ));
    
    const riskLevelEl = document.getElementById('riskLevel');
    if (result.churn >= 30) {
        riskLevelEl.innerText = currentLang === 'zh' ? '🔴 高流失風險' : currentLang === 'cn' ? '🔴 高流失风险' : '🔴 High Churn Risk';
    } else if (result.churn >= 20) {
        riskLevelEl.innerText = currentLang === 'zh' ? '🟠 中高流失風險' : currentLang === 'cn' ? '🟠 中高流失风险' : '🟠 Medium-High Churn Risk';
    } else if (result.churn >= 10) {
        riskLevelEl.innerText = currentLang === 'zh' ? '🟡 中流失風險' : currentLang === 'cn' ? '🟡 中流失风险' : '🟡 Medium Churn Risk';
    } else {
        riskLevelEl.innerText = currentLang === 'zh' ? '🟢 低流失風險' : currentLang === 'cn' ? '🟢 低流失风险' : '🟢 Low Churn Risk';
    }
}

function updateUIText(result) {
    let name, insight, actions, goal;
    
    if (currentLang === 'en') {
        name = result.nameEn;
        insight = result.insightEn;
        actions = result.actionsEn;
        goal = result.goalEn;
    } else if (currentLang === 'cn') {
        name = result.nameCn;
        insight
