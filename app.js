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
            },
            {
                id: 'prop-3',
                title: 'ویلای لوکس در زعفرانیه',
                category: 'residential',
                address: 'تهران، زعفرانیه، کوچه بهار',
                price: 15000000000,
                area: 300,
                images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
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
            },
            {
                id: 'client-2',
                name: 'فاطمه احمدی',
                phone: '09128765432',
                requestType: 'rent',
                propertyType: 'commercial',
                budgetMin: 50000000,
                budgetMax: 100000000
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
            },
            {
                id: 'task-2',
                title: 'تماس با مشتری زعفرانیه',
                date: '1403/09/16',
                time: '16:00',
                priority: 'medium',
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
        this.renderTabContent();
        
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
            commission: `کمیسیون (${this.commissions.length})`,
            add: 'ثبت مورد جدید'
        };
        
        if (headerTitle) {
            headerTitle.textContent = titles[tab] || 'سامانه تهرانک';
        }
        
        // Show/hide content
        this.renderTabContent();
    }

    renderTabContent() {
        // Hide all content areas
        const mainContent = document.getElementById('main-content');
        const tabContents = document.querySelectorAll('[id$="-tab"]');
        
        tabContents.forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Show home content by default, or specific tab content
        if (this.currentTab === 'home') {
            mainContent.style.display = 'block';
        } else {
            mainContent.style.display = 'none';
            const tabContent = document.getElementById(`${this.currentTab}-tab`);
            if (tabContent) {
                tabContent.style.display = 'block';
            }
        }
        
        // Render specific tab content
        switch (this.currentTab) {
            case 'properties':
                this.renderPropertiesList();
                break;
            case 'clients':
                this.renderClientsList();
                break;
            case 'tasks':
                this.renderTasksList();
                break;
            case 'commission':
                this.renderCommissionList();
                break;
        }
    }

    renderPropertiesList() {
        const container = document.getElementById('properties-list');
        if (!container) return;
        
        container.innerHTML = this.properties.map(property => `
            <div style="
                background: #1E293B;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: white; font-weight: bold; margin-bottom: 8px;">${property.title}</h3>
                        <p style="color: #94A3B8; font-size: 14px; margin-bottom: 4px;">📍 ${property.address}</p>
                        <p style="color: #10B981; font-weight: bold;">${this.formatPrice(property.price)}</p>
                        <p style="color: #64748B; font-size: 12px;">${property.area} متر • ${property.category === 'residential' ? 'مسکونی' : 'تجاری'}</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="app.openPropertyDetail('${property.id}')" style="
                            background: #3B82F6;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">جزئیات</button>
                        <button onclick="app.editProperty('${property.id}')" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderClientsList() {
        const container = document.getElementById('clients-list');
        if (!container) return;
        
        container.innerHTML = this.clients.map(client => `
            <div style="
                background: #1E293B;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: white; font-weight: bold; margin-bottom: 8px;">${client.name}</h3>
                        <p style="color: #94A3B8; font-size: 14px; margin-bottom: 4px;">📱 ${client.phone}</p>
                        <p style="color: #64748B; font-size: 12px;">
                            ${client.requestType === 'sale' ? 'خرید' : 'رهن و اجاره'} • 
                            ${client.propertyType === 'residential' ? 'مسکونی' : 'تجاری'}
                        </p>
                        <p style="color: #F97316; font-size: 12px;">
                            بودجه: ${this.formatPrice(client.budgetMin)} - ${this.formatPrice(client.budgetMax)}
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="window.open('tel:${client.phone}', '_self')" style="
                            background: #10B981;
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">📞</button>
                        <button onclick="app.editClient('${client.id}')" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTasksList() {
        const container = document.getElementById('tasks-list');
        if (!container) return;
        
        container.innerHTML = this.tasks.map(task => `
            <div style="
                background: #1E293B;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: white; font-weight: bold; margin-bottom: 8px;">${task.title}</h3>
                        <p style="color: #94A3B8; font-size: 14px; margin-bottom: 4px;">
                            📅 ${task.date} • ⏰ ${task.time}
                        </p>
                        <p style="color: ${task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F97316' : '#64748B'}; font-size: 12px;">
                            اولویت: ${task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="app.toggleTask('${task.id}')" style="
                            background: ${task.isCompleted ? '#10B981' : 'rgba(255,255,255,0.1)'};
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">${task.isCompleted ? '✅' : '⭕'}</button>
                        <button onclick="app.editTask('${task.id}')" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCommissionList() {
        const container = document.getElementById('commission-list');
        if (!container) return;
        
        container.innerHTML = this.commissions.map(commission => `
            <div style="
                background: #1E293B;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid rgba(255,255,255,0.1);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: white; font-weight: bold; margin-bottom: 8px;">
                            خریدار: ${commission.buyerName}
                        </h3>
                        <p style="color: #94A3B8; font-size: 14px; margin-bottom: 4px;">
                            فروشنده: ${commission.sellerName}
                        </p>
                        <p style="color: #10B981; font-weight: bold; margin-bottom: 4px;">
                            ${this.formatPrice(commission.propertyPrice)}
                        </p>
                        <p style="color: #F97316; font-size: 12px;">
                            سهم شما: ${this.formatPrice(commission.agentShare)}
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span style="
                            background: ${commission.isPaid ? '#10B981' : '#F97316'};
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                        ">
                            ${commission.isPaid ? 'پرداخت شده' : 'در انتظار'}
                        </span>
                        <button onclick="app.editCommission('${commission.id}')" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openSearch() {
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
                background: #1E293B;
                border-radius: 24px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow: hidden;
                animation: slideUp 0.4s ease;
            ">
                <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: white; font-size: 20px; font-weight: bold;">جستجو</h2>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: #94A3B8; cursor: pointer;">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div style="padding: 24px;">
                    <div style="margin-bottom: 16px;">
                        <label style="color: #94A3B8; display: block; margin-bottom: 8px; font-size: 14px;">عنوان یا آدرس</label>
                        <input type="text" id="search-text" placeholder="مثال: آپارتمان نیاوران" style="
                            width: 100%;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            padding: 12px;
                            color: white;
                            font-size: 16px;
                            outline: none;
                        ">
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button onclick="app.performSearch()" style="
                            flex: 1;
                            background: #3B82F6;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-weight: 500;
                            cursor: pointer;
                        ">جستجو</button>
                        <button onclick="app.closeModal()" style="
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            cursor: pointer;
                        ">لغو</button>
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

    performSearch() {
        const searchText = document.getElementById('search-text').value.trim();
        if (!searchText) {
            alert('لطفاً متن جستجو را وارد کنید');
            return;
        }
        
        // Simple search in properties
        const results = this.properties.filter(property => 
            property.title.toLowerCase().includes(searchText.toLowerCase()) ||
            property.address.toLowerCase().includes(searchText.toLowerCase())
        );
        
        if (results.length > 0) {
            this.closeModal();
            alert(`${results.length} مورد یافت شد`);
        } else {
            alert('هیچ موردی یافت نشد');
        }
    }

    openSettings() {
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
                background: #1E293B;
                border-radius: 24px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow: hidden;
                animation: slideUp 0.4s ease;
            ">
                <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: white; font-size: 20px; font-weight: bold;">تنظیمات</h2>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; color: #94A3B8; cursor: pointer;">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div style="padding: 24px;">
                    <div style="margin-bottom: 16px;">
                        <label style="color: #94A3B8; display: block; margin-bottom: 8px; font-size: 14px;">نام کاربری</label>
                        <input type="text" id="username" value="${this.currentUser || 'مدیر سیستم'}" style="
                            width: 100%;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            padding: 12px;
                            color: white;
                            font-size: 16px;
                            outline: none;
                        ">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="color: #94A3B8; display: block; margin-bottom: 8px; font-size: 14px;">تم</label>
                        <select id="theme-select" style="
                            width: 100%;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            padding: 12px;
                            color: white;
                            font-size: 16px;
                            outline: none;
                        ">
                            <option value="dark" ${this.theme === 'dark' ? 'selected' : ''}>تیره</option>
                            <option value="light" ${this.theme === 'light' ? 'selected' : ''}>روشن</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="color: #94A3B8; display: block; margin-bottom: 8px; font-size: 14px;">زبان</label>
                        <select id="language-select" style="
                            width: 100%;
                            background: rgba(255,255,255,0.1);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 12px;
                            padding: 12px;
                            color: white;
                            font-size: 16px;
                            outline: none;
                        ">
                            <option value="fa">فارسی</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button onclick="app.saveSettings()" style="
                            flex: 1;
                            background: #3B82F6;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-weight: 500;
                            cursor: pointer;
                        ">ذخیره</button>
                        <button onclick="app.logout()" style="
                            flex: 1;
                            background: #EF4444;
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 12px;
                            font-weight: 500;
                            cursor: pointer;
                        ">خروج</button>
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

    saveSettings() {
        const username = document.getElementById('username').value;
        const theme = document.getElementById('theme-select').value;
        const language = document.getElementById('language-select').value;
        
        this.currentUser = username;
        this.theme = theme;
        
        // Save to localStorage
        localStorage.setItem('tehranak-username', username);
        localStorage.setItem('tehranak-theme', theme);
        localStorage.setItem('tehranak-language', language);
        
        // Apply theme
        this.loadTheme();
        
        // Update header
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) {
            headerTitle.textContent = `سلام ${username}`;
        }
        
        this.closeModal();
        alert('تنظیمات با موفقیت ذخیره شد');
    }

    logout() {
        if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
            localStorage.removeItem('tehranak-username');
            this.currentUser = null;
            alert('با موفقیت خارج شدید');
            window.location.reload();
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    setupDynamicIsland() {
        const island = document.getElementById('dynamic-island');
        const islandContent = document.getElementById('island-content');
        
        if (!island || !islandContent) return;
        
        // Cycling content when collapsed
        let currentMode = 0;
        const modes = ['تهرانک', 'دستیار صوتی', 'الکسا'];
        
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
        if (this.isDynamicIslandExpanded) {
            this.showAlexaInterface();
        }
    }

    handleVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Simple responses based on Persian commands
        let response = '';
        if (transcript.includes('املاک')) {
            response = 'تعداد املاک شما ' + this.properties.length + ' عدد است';
        } else if (transcript.includes('مشتری')) {
            response = 'تعداد مشتریان شما ' + this.clients.length + ' عدد است';
        } else if (transcript.includes('وظیفه')) {
            response = 'تعداد وظایف شما ' + this.tasks.filter(t => !t.isCompleted).length + ' عدد است';
        } else {
            response = 'متوجه نشدم، لطفاً دوباره بفرمایید';
        }
        
        // Speak the response
        this.speak(response);
        
        // Show in chat area
        this.addChatMessage(transcript, 'user');
        this.addChatMessage(response, 'bot');
    }

    addChatMessage(message, sender) {
        // Simple implementation - add to chat area
        const chatArea = document.querySelector('#dynamic-island .overflow-y-auto');
        if (chatArea) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin-bottom: 12px;
                display: ${sender === 'user' ? 'flex' : 'flex'};
                justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
            `;
            
            messageDiv.innerHTML = `
                <div style="
                    background: ${sender === 'user' ? '#3B82F6' : 'rgba(255,255,255,0.1)'};
                    color: white;
                    padding: 8px 12px;
                    border-radius: 12px;
                    max-width: 70%;
                    font-size: 14px;
                ">${message}</div>
            `;
            
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    sendAlexaMessage() {
        const input = document.getElementById('alexa-input');
        if (input && input.value.trim()) {
            const message = input.value.trim();
            input.value = '';
            
            // Handle text input similar to voice
            this.handleVoiceInput(message);
        }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fa-IR';
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            
            // Try to find a Persian voice
            const voices = speechSynthesis.getVoices();
            const persianVoice = voices.find(voice => 
                voice.lang.includes('fa') || voice.lang.includes('Persian')
            );
            if (persianVoice) {
                utterance.voice = persianVoice;
            }
            
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

    editProperty(id) {
        alert('ویرایش ملک در حال توسعه...');
    }

    editClient(id) {
        alert('ویرایش مشتری در حال توسعه...');
    }

    editTask(id) {
        alert('ویرایش وظیفه در حال توسعه...');
    }

    editCommission(id) {
        alert('ویرایش کمیسیون در حال توسعه...');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.isCompleted = !task.isCompleted;
            this.renderTasksList();
            this.updateStats();
        }
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