/**
 * Tehranak Real Estate PWA - Complete Implementation
 * Based on the comprehensive specification from the creator
 */

class TehranakApp {
    constructor() {
        this.currentTab = 'home';
        this.theme = 'dark';
        this.isDynamicIslandExpanded = false;
        this.isVoiceModeActive = false;
        this.isListening = false;
        this.currentUser = null;
        
        // Sample data
        this.properties = [
            {
                id: 'prop-1',
                title: 'آپارتمان مدرن در نیاوران',
                category: 'residential',
                address: 'تهران، منطقه ۱، نیاوران',
                price: 8500000000,
                area: 120,
                images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']
            },
            {
                id: 'prop-2',
                title: 'مغازه تجاری در ولیعصر',
                category: 'commercial',
                address: 'تهران، خیابان ولیعصر',
                price: 25000000,
                area: 45,
                images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800']
            }
        ];
        
        this.clients = [
            {
                id: 'client-1',
                name: 'رضا محمدی',
                phone: '09123456789',
                requestType: 'sale',
                propertyType: 'residential',
                budgetMin: 5000000000,
                budgetMax: 10000000000
            }
        ];
        
        this.tasks = [
            {
                id: 'task-1',
                title: 'بازدید از ملک نیاوران',
                date: '1403/09/15',
                time: '14:30',
                priority: 'high',
                isCompleted: false
            }
        ];
        
        this.commissions = [
            {
                id: 'comm-1',
                buyerName: 'احمد احمدی',
                sellerName: 'فاطمه رضایی',
                propertyPrice: 8500000000,
                totalCommission: 85000000,
                agentShare: 42500000,
                isPaid: false
            }
        ];
        
        this.init();
    }

    async init() {
        await this.delay(2000); // Show splash screen
        
        // Hide splash screen
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            document.getElementById('main-app').style.display = 'block';
        }, 500);
        
        // Initialize app
        this.setupEventListeners();
        this.setupDynamicIsland();
        this.loadTheme();
        this.updateStats();
        this.startSliderRotation();
        
        // Initialize AI voice assistant
        this.initializeVoiceAssistant();
        
        console.log('Tehranak PWA initialized successfully');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Header buttons
        document.getElementById('search-btn').addEventListener('click', () => {
            this.openSearch();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });

        // Property slider click
        document.getElementById('property-slider').addEventListener('click', () => {
            this.openPropertyDetail();
        });

        // Dynamic Island
        document.getElementById('dynamic-island').addEventListener('click', () => {
            this.toggleDynamicIsland();
        });
    }

    switchTab(tab) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        this.currentTab = tab;
        
        // Update header title
        const headerTitle = document.getElementById('header-title');
        const titles = {
            home: 'سلام مدیر سیستم',
            properties: `املاک (${this.properties.length})`,
            clients: `مشتریان (${this.clients.length})`,
            tasks: `وظایف (${this.tasks.length})`,
            commission: `کمیسیون‌ها (${this.commissions.length})`,
            add: 'ثبت موارد جدید'
        };
        headerTitle.textContent = titles[tab] || titles.home;

        // Update content based on tab
        this.updateTabContent(tab);
    }

    updateTabContent(tab) {
        const content = document.querySelector('.content');
        
        switch (tab) {
            case 'home':
                this.renderHomeContent(content);
                break;
            case 'properties':
                this.renderPropertiesContent(content);
                break;
            case 'clients':
                this.renderClientsContent(content);
                break;
            case 'tasks':
                this.renderTasksContent(content);
                break;
            case 'commission':
                this.renderCommissionContent(content);
                break;
            case 'add':
                this.renderAddContent(content);
                break;
        }
    }

    renderHomeContent(content) {
        content.innerHTML = `
            <div style="animation: slideUp 0.4s ease-out;">
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 21h18v-2H3v2zM21 11H3v2h18v-2zM21 1H3v2h18V1z"/>
                                <path d="M5 21V5h14v16H5zM5 1v16h14V1H5z"/>
                            </svg>
                        </div>
                        <div class="stat-title">املاک</div>
                        <div class="stat-value">${this.properties.length}</div>
                        <div class="stat-subtitle">فعال</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div class="stat-title">مشتریان</div>
                        <div class="stat-value">${this.clients.length}</div>
                        <div class="stat-subtitle">جدید: ۲</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon green">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <div class="stat-title">درآمد</div>
                        <div class="stat-value">${this.calculateIncome()}M</div>
                        <div class="stat-subtitle">این ماه</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon pink">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
                                <path d="M13 7h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                <path d="M17 11h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                            </svg>
                        </div>
                        <div class="stat-title">وظایف</div>
                        <div class="stat-value">${this.tasks.filter(t => !t.isCompleted).length}</div>
                        <div class="stat-subtitle">در انتظار</div>
                    </div>
                </div>

                <!-- Property Slider -->
                <div class="property-slider" id="property-slider">
                    <img src="${this.properties[0].images[0]}" alt="Property" class="slider-image" id="slider-image">
                    <div class="slider-overlay"></div>
                    <div class="slider-content">
                        <div class="slider-title">${this.properties[0].title}</div>
                        <div class="slider-subtitle">${this.properties[0].address}</div>
                        <div class="slider-price">${this.formatPrice(this.properties[0].price)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPropertiesContent(content) {
        const propertiesHtml = this.properties.map(property => `
            <div style="
                background: #1c1c1e; 
                border-radius: 24px; 
                padding: 16px; 
                margin-bottom: 16px; 
                border: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: all 0.3s ease;
            " onclick="app.openPropertyDetail('${property.id}')">
                <img src="${property.images[0]}" alt="${property.title}" style="
                    width: 100%; 
                    height: 120px; 
                    object-fit: cover; 
                    border-radius: 12px;
                    margin-bottom: 12px;
                ">
                <div style="margin-bottom: 8px;">
                    <h3 style="font-size: 16px; font-weight: bold; color: white; margin-bottom: 4px;">${property.title}</h3>
                    <p style="font-size: 12px; color: #94A3B8; display: flex; align-items: center;">
                        <span style="margin-left: 4px;">📍</span>
                        ${property.address}
                    </p>
                </div>
                <div style="color: #10B981; font-weight: bold; font-size: 14px;">
                    ${this.formatPrice(property.price)}
                </div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">
                    ${property.area} متر مربع
                </div>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="animation: slideUp 0.4s ease-out;">
                <h2 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 24px;">
                    املاک (${this.properties.length})
                </h2>
                ${propertiesHtml}
                ${this.properties.length === 0 ? `
                    <div style="text-align: center; padding: 48px; color: #94A3B8;">
                        <svg width="48" height="48" style="margin-bottom: 16px; opacity: 0.5;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 21h18v-2H3v2zM21 11H3v2h18v-2zM21 1H3v2h18V1z"/>
                            <path d="M5 21V5h14v16H5zM5 1v16h14V1H5z"/>
                        </svg>
                        <p>هنوز ملکی ثبت نشده است</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderClientsContent(content) {
        const clientsHtml = this.clients.map(client => `
            <div style="
                background: #1c1c1e; 
                border-radius: 16px; 
                padding: 16px; 
                margin-bottom: 16px; 
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        background: linear-gradient(135deg, #EC4899, #F97316);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 14px;
                    ">${client.name.charAt(0)}</div>
                    <div style="flex: 1;">
                        <h4 style="font-weight: bold; color: white; margin-bottom: 4px;">${client.name}</h4>
                        <span style="font-size: 12px; color: #94A3B8;">
                            ${client.requestType === 'sale' ? 'خرید' : 'اجاره'} - 
                            ${client.propertyType === 'residential' ? 'مسکونی' : 'تجاری'}
                        </span>
                    </div>
                    <div style="width: 6px; height: 6px; background: #8B5CF6; border-radius: 50%;"></div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; margin-bottom: 12px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
                        <div style="color: #94A3B8;">بودجه:</div>
                        <div style="color: white; font-weight: 500;">
                            ${client.budgetMin && client.budgetMax 
                                ? `${(client.budgetMin / 1000000).toFixed(0)}-${(client.budgetMax / 1000000).toFixed(0)}M`
                                : 'نامشخص'
                            }
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px;">
                        <div style="color: #94A3B8;">متراژ:</div>
                        <div style="color: white; font-weight: 500;">نامشخص</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button onclick="window.open('tel:${client.phone}', '_self')" style="
                        flex: 1;
                        background: rgba(59, 130, 246, 0.1);
                        color: #3B82F6;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 4px;
                    ">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        تماس
                    </button>
                    <button style="
                        background: rgba(249, 115, 22, 0.1);
                        color: #F97316;
                        border: none;
                        padding: 8px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button style="
                        background: rgba(239, 68, 68, 0.1);
                        color: #EF4444;
                        border: none;
                        padding: 8px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="animation: slideUp 0.4s ease-out;">
                <h2 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 24px;">
                    مشتریان (${this.clients.length})
                </h2>
                ${clientsHtml}
                ${this.clients.length === 0 ? `
                    <div style="text-align: center; padding: 48px; color: #94A3B8;">
                        <svg width="48" height="48" style="margin-bottom: 16px; opacity: 0.5;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <p>هنوز مشتری‌ای ثبت نشده است</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderTasksContent(content) {
        content.innerHTML = `
            <div style="animation: slideUp 0.4s ease-out;">
                <h2 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 24px;">
                    وظایف (${this.tasks.length})
                </h2>
                <div style="text-align: center; padding: 48px; color: #94A3B8;">
                    <svg width="48" height="48" style="margin-bottom: 16px; opacity: 0.5;" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/>
                        <path d="M13 7h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        <path d="M17 11h-2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                    <p>بخش وظایف در حال تکمیل است</p>
                    <p style="font-size: 12px; margin-top: 8px;">به زودی با امکانات کامل منتشر خواهد شد</p>
                </div>
            </div>
        `;
    }

    renderCommissionContent(content) {
        content.innerHTML = `
            <div style="animation: slideUp 0.4s ease-out;">
                <h2 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 24px;">
                    کمیسیون‌ها (${this.commissions.length})
                </h2>
                <div style="text-align: center; padding: 48px; color: #94A3B8;">
                    <svg width="48" height="48" style="margin-bottom: 16px; opacity: 0.5;" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <p>بخش کمیسیون‌ها در حال تکمیل است</p>
                    <p style="font-size: 12px; margin-top: 8px;">محاسبه و پیگیری کمیسیون‌ها</p>
                </div>
            </div>
        `;
    }

    renderAddContent(content) {
        content.innerHTML = `
            <div style="text-align: center; padding: 48px; animation: slideUp 0.4s ease-out;">
                <div style="
                    width: 48px; 
                    height: 48px; 
                    margin: 0 auto 16px; 
                    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg width="24" height="24" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </div>
                <h2 style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 8px;">
                    ثبت موارد جدید
                </h2>
                <p style="color: #94A3B8; font-size: 14px;">
                    لطفاً از دکمه + در نوار پایین استفاده کنید
                </p>
            </div>
        `;
    }

    setupDynamicIsland() {
        const island = document.getElementById('dynamic-island');
        const islandContent = document.getElementById('island-content');
        
        let currentMode = 0;
        const modes = ['TEHRANAK', '', ''];
        
        // Update time every second
        setInterval(() => {
            if (!this.isDynamicIslandExpanded) {
                const now = new Date();
                const time = now.toLocaleTimeString('fa-IR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                modes[1] = time;
                
                const date = new Intl.DateTimeFormat('fa-IR', {
                    month: 'long',
                    day: 'numeric'
                }).format(now);
                modes[2] = date;
                
                islandContent.textContent = modes[currentMode];
                
                currentMode = (currentMode + 1) % modes.length;
            }
        }, 7000);
        
        // Click handler
        island.addEventListener('click', () => {
            this.toggleDynamicIsland();
        });
    }

    toggleDynamicIsland() {
        const island = document.getElementById('dynamic-island');
        
        if (this.isDynamicIslandExpanded) {
            island.classList.remove('expanded');
            island.classList.add('collapsed');
            island.style.height = '36px';
            island.style.width = '180px';
            island.style.borderRadius = '18px';
            this.isDynamicIslandExpanded = false;
        } else {
            island.classList.remove('collapsed');
            island.classList.add('expanded');
            island.style.height = '500px';
            island.style.width = '92%';
            island.style.borderRadius = '40px';
            this.isDynamicIslandExpanded = true;
            
            // Show Alexa interface
            this.showAlexaInterface();
        }
    }

    showAlexaInterface() {
        const island = document.getElementById('dynamic-island');
        island.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; color: white; font-family: 'Vazirmatn', sans-serif;">
                <!-- Header -->
                <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="
                            width: 32px; 
                            height: 32px; 
                            border-radius: 50%; 
                            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: 14px;
                        ">A</div>
                        <div>
                            <div style="font-weight: bold;">الکسا (دستیار صوتی)</div>
                            <div style="font-size: 12px; color: #94A3B8;">
                                ${this.isVoiceModeActive ? (this.isListening ? 'گوش‌به‌زنگ...' : 'حالت صوتی فعال') : 'حالت صوتی خاموش'}
                            </div>
                        </div>
                    </div>
                    <button onclick="app.toggleDynamicIsland()" style="background: none; border: none; color: white; cursor: pointer;">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Chat Area -->
                <div style="flex: 1; padding: 16px; overflow-y: auto;">
                    <div style="text-align: center; color: #94A3B8; margin: 24px 0;">
                        <div style="font-size: 14px;">سلام! من الکسا هستم</div>
                        <div style="font-size: 12px; margin-top: 4px;">چطور می‌تونم کمکتون کنم؟</div>
                    </div>
                </div>

                <!-- Input Area -->
                <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button onclick="app.toggleVoiceMode()" style="
                            padding: 8px;
                            border-radius: 50%;
                            background: ${this.isVoiceModeActive 
                                ? (this.isListening ? '#EF4444 animate-pulse' : '#6B7280')
                                : '#6B7280'
                            };
                            border: none;
                            color: white;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            ${this.isVoiceModeActive 
                                ? (this.isListening 
                                    ? '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
                                    : '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
                                )
                                : '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
                            }
                        </button>
                        
                        <input type="text" placeholder="سوال خود را بنویسید..." style="
                            flex: 1;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            padding: 8px 12px;
                            color: white;
                            font-size: 14px;
                            outline: none;
                        " id="alexa-input">
                        
                        <button onclick="app.sendAlexaMessage()" style="
                            padding: 8px;
                            background: #3B82F6;
                            border: none;
                            border-radius: 50%;
                            color: white;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 2L11 13"/>
                                <polygon points="22,2 15,22 11,13 2,9"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleVoiceMode() {
        this.isVoiceModeActive = !this.isVoiceModeActive;
        
        if (this.isVoiceModeActive) {
            this.startVoiceRecognition();
        } else {
            this.stopVoiceRecognition();
        }
        
        this.updateVoiceModeUI();
    }

    startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'fa-IR';

            recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceModeUI();
            };

            recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceModeUI();
                
                if (this.isVoiceModeActive) {
                    setTimeout(() => recognition.start(), 1000);
                }
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceInput(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceModeUI();
            };

            recognition.start();
        } else {
            alert('تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود');
        }
    }

    stopVoiceRecognition() {
        this.isListening = false;
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    updateVoiceModeUI() {
        // Update island if open
        if (this.isDynamicIslandExpanded) {
            const statusElement = document.querySelector('[style*="حالت صوتی"]');
            if (statusElement) {
                statusElement.textContent = this.isVoiceModeActive 
                    ? (this.isListening ? 'گوش‌به‌زنگ...' : 'حالت صوتی فعال')
                    : 'حالت صوتی خاموش';
            }
        }
    }

    handleVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Mock AI response based on input
        let response = 'متوجه نشدم. می‌تونید واضح‌تر صحبت کنید؟';
        
        if (transcript.includes('سلام') || transcript.includes('hello')) {
            response = 'سلام! چطور می‌تونم کمکتون کنم؟';
        } else if (transcript.includes('املاک') || transcript.includes('property')) {
            response = `شما ${this.properties.length} ملک دارید. می‌خواید در مورد کدوم صحبت کنیم؟`;
        } else if (transcript.includes('مشتری') || transcript.includes('client')) {
            response = `${this.clients.length} مشتری دارید. می‌خواید چه کاری انجام بدیم؟`;
        } else if (transcript.includes('وظیفه') || transcript.includes('task')) {
            response = `${this.tasks.filter(t => !t.isCompleted).length} وظیفه در انتظار دارید.`;
        }
        
        // Show response
        this.showAlexaMessage('alexa', response);
        
        // Text to speech
        this.speakText(response);
    }

    sendAlexaMessage() {
        const input = document.getElementById('alexa-input');
        const message = input.value.trim();
        
        if (message) {
            this.showAlexaMessage('user', message);
            input.value = '';
            
            // Mock AI response
            setTimeout(() => {
                let response = 'متوجه نشدم. می‌تونید واضح‌تر بگید؟';
                
                if (message.includes('سلام')) {
                    response = 'سلام! خوشحالم که اینجا هستید. چطور می‌تونم کمکتون کنم؟';
                } else if (message.includes('املاک')) {
                    response = `شما ${this.properties.length} ملک دارید. آیا می‌خواید اطلاعات بیشتری بدونید؟`;
                } else if (message.includes('مشتری')) {
                    response = `${this.clients.length} مشتری دارید. می‌تونید لیستشون رو ببینید.`;
                }
                
                this.showAlexaMessage('alexa', response);
                this.speakText(response);
            }, 1000);
        }
    }

    showAlexaMessage(role, content) {
        const chatArea = document.querySelector('.content');
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
            <div style="
                display: flex; 
                ${role === 'user' ? 'justify-content: flex-start;' : 'justify-content: flex-end;'}
                margin-bottom: 12px;
            ">
                <div style="
                    max-width: 80%; 
                    padding: 12px; 
                    border-radius: 16px; 
                    font-size: 14px;
                    ${role === 'user' 
                        ? 'background: #333333; color: white; border-bottom-left-radius: 4px;'
                        : 'background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; border-bottom-right-radius: 4px;'
                    }
                ">${content}</div>
            </div>
        `;
        
        // Insert message before input area
        const inputArea = chatArea.querySelector('.input-area');
        if (inputArea) {
            chatArea.insertBefore(messageDiv, inputArea);
        }
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fa-IR';
            utterance.pitch = 1.3;
            utterance.rate = 1.0;

            speechSynthesis.speak(utterance);
        }
    }

    initializeVoiceAssistant() {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window)) {
            console.log('Speech recognition not supported in this browser');
            return;
        }

        // Initialize with default state
        this.isVoiceModeActive = false;
        this.isListening = false;
    }

    startSliderRotation() {
        let currentIndex = 0;
        
        setInterval(() => {
            if (this.properties.length > 1) {
                currentIndex = (currentIndex + 1) % this.properties.length;
                this.updateSlider(currentIndex);
            }
        }, 5000);
    }

    updateSlider(index) {
        const property = this.properties[index];
        const image = document.getElementById('slider-image');
        const title = document.getElementById('slider-title');
        const subtitle = document.getElementById('slider-subtitle');
        const price = document.getElementById('slider-price');
        
        if (property && image && title && subtitle && price) {
            image.src = property.images[0];
            title.textContent = property.title;
            subtitle.textContent = property.address;
            price.textContent = this.formatPrice(property.price);
        }
    }

    updateStats() {
        // Update statistics based on current data
        const stats = {
            properties: this.properties.length,
            clients: this.clients.length,
            income: this.calculateIncome(),
            tasks: this.tasks.filter(t => !t.isCompleted).length
        };
        
        // Update the DOM elements if they exist
        const propertiesCount = document.getElementById('properties-count');
        const clientsCount = document.getElementById('clients-count');
        const incomeCount = document.getElementById('income-count');
        const tasksCount = document.getElementById('tasks-count');
        
        if (propertiesCount) propertiesCount.textContent = stats.properties;
        if (clientsCount) clientsCount.textContent = stats.clients;
        if (incomeCount) incomeCount.textContent = stats.income + 'M';
        if (tasksCount) tasksCount.textContent = stats.tasks;
    }

    calculateIncome() {
        const totalIncome = this.commissions.reduce((sum, commission) => {
            return sum + (commission.agentShare || 0);
        }, 0);
        return (totalIncome / 1000000000).toFixed(1);
    }

    formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    loadTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('tehranak-theme');
        this.theme = savedTheme || 'dark';
        
        // Apply theme
        if (this.theme === 'dark') {
            document.body.style.backgroundColor = '#0F172A';
            document.body.style.color = '#E2E8F0';
        } else {
            document.body.style.backgroundColor = '#F8FAFC';
            document.body.style.color = '#1E293B';
        }
    }

    openSearch() {
        console.log('Opening search...');
        // TODO: Implement search modal
    }

    openSettings() {
        console.log('Opening settings...');
        // TODO: Implement settings modal
    }

    openPropertyDetail(propertyId = null) {
        const property = this.properties.find(p => p.id === propertyId) || this.properties[0];
        if (!property) return;
        
        // Create property detail modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: ${this.theme === 'dark' ? '#1E293B' : 'white'};
                border-radius: 24px;
                max-width: 90%;
                max-height: 90%;
                overflow: hidden;
                animation: slideUp 0.4s ease;
            ">
                <div style="position: relative; height: 300px;">
                    <img src="${property.images[0]}" alt="${property.title}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    ">
                    <button onclick="this.closest('.modal').remove()" style="
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        width: 40px;
                        height: 40px;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        border-radius: 50%;
                        color: white;
                        cursor: pointer;
                    ">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div style="padding: 24px;">
                    <h2 style="font-size: 20px; font-weight: bold; color: ${this.theme === 'dark' ? 'white' : '#1E293B'}; margin-bottom: 12px;">
                        ${property.title}
                    </h2>
                    <p style="color: ${this.theme === 'dark' ? '#94A3B8' : '#64748B'}; margin-bottom: 16px; display: flex; align-items: center;">
                        <span style="margin-left: 4px;">📍</span>
                        ${property.address}
                    </p>
                    <div style="color: #10B981; font-size: 18px; font-weight: bold; margin-bottom: 16px;">
                        ${this.formatPrice(property.price)}
                    </div>
                    <div style="color: ${this.theme === 'dark' ? '#94A3B8' : '#64748B'}; font-size: 14px; margin-bottom: 24px;">
                        ${property.area} متر مربع • ${property.category === 'residential' ? 'مسکونی' : 'تجاری'}
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button onclick="window.open('tel:09121234567', '_self')" style="
                            flex: 1;
                            background: #10B981;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-weight: 500;
                            cursor: pointer;
                        ">
                            تماس با مالک
                        </button>
                        <button onclick="navigator.share ? navigator.share({title: '${property.title}', text: '${property.address}'}) : alert('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود')" style="
                            background: ${this.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                            color: ${this.theme === 'dark' ? 'white' : '#1E293B'};
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16,6 12,2 8,6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TehranakApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}