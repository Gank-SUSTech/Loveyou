// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    let uploadedImages = [];
    let letterBackgrounds = [
        'linear-gradient(to bottom, #fff9fb 0%, #fff 100%)',
        'linear-gradient(to bottom, #fef9e7 0%, #fff 100%)',
        'linear-gradient(to bottom, #e8f4f8 0%, #fff 100%)',
        'linear-gradient(to bottom, #f4ecf7 0%, #fff 100%)',
        'linear-gradient(to bottom, #e8f8f5 0%, #fff 100%)'
    ];
    let currentBgIndex = 0;
    let isMusicPlaying = true;
    
    // 初始化页面
    initPage();
    
    // 初始化页面函数
    function initPage() {
        // 设置当前日期
        setCurrentDate();
        
        // 创建浮动爱心
        createFloatingHearts();
        
        // 从本地存储加载数据
        loadFromLocalStorage();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 更新预览
        updatePreview();
        
        // 开始播放背景音乐
        playBackgroundMusic();
    }
    
    // 设置当前日期
    function setCurrentDate() {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('zh-CN', options);
    }
    
    // 创建浮动爱心
    function createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // 随机大小
            const size = Math.random() * 15 + 10;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            
            // 随机颜色
            const colors = ['#ff7eb9', '#ff758c', '#ffaa80', '#ffd166'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.backgroundColor = color;
            
            // 随机位置和动画延迟
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            
            // 设置伪元素颜色
            heart.style.setProperty('--heart-color', color);
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // 从本地存储加载数据
    function loadFromLocalStorage() {
        // 加载情书内容
        const savedLetter = localStorage.getItem('loveLetter');
        if (savedLetter) {
            document.getElementById('love-letter').value = savedLetter;
        }
        
        // 加载发件人姓名
        const savedSenderName = localStorage.getItem('senderName');
        if (savedSenderName) {
            document.getElementById('sender-name').textContent = savedSenderName;
        }
        
        // 加载收件人姓名
        const savedRecipientName = localStorage.getItem('recipientName');
        if (savedRecipientName) {
            document.getElementById('recipient-name').textContent = savedRecipientName;
        }
        
        // 加载上传的图片
        const savedImages = localStorage.getItem('uploadedImages');
        if (savedImages) {
            uploadedImages = JSON.parse(savedImages);
            renderImageGallery();
        }
        
        // 加载音乐设置
        const savedMusicSetting = localStorage.getItem('isMusicPlaying');
        if (savedMusicSetting !== null) {
            isMusicPlaying = savedMusicSetting === 'true';
            updateMusicButton();
        }
    }
    
    // 保存到本地存储
    function saveToLocalStorage() {
        // 保存情书内容
        const letterContent = document.getElementById('love-letter').value;
        localStorage.setItem('loveLetter', letterContent);
        
        // 保存发件人姓名
        const senderName = document.getElementById('sender-name').textContent;
        localStorage.setItem('senderName', senderName);
        
        // 保存收件人姓名
        const recipientName = document.getElementById('recipient-name').textContent;
        localStorage.setItem('recipientName', recipientName);
        
        // 保存上传的图片
        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        
        // 保存音乐设置
        localStorage.setItem('isMusicPlaying', isMusicPlaying.toString());
        
        // 显示保存通知
        showNotification('内容已保存！');
    }
    
    // 显示通知
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.querySelector('p').textContent = message;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 保存情书按钮
        document.getElementById('save-letter').addEventListener('click', saveToLocalStorage);
        
        // 打印情书按钮
        document.getElementById('print-letter').addEventListener('click', printLetter);
        
        // 更换信纸背景按钮
        document.getElementById('change-bg').addEventListener('click', changeLetterBackground);
        
        // 图片上传
        document.getElementById('image-upload').addEventListener('change', handleImageUpload);
        
        // 拖拽上传
        const uploadArea = document.getElementById('upload-area');
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        
        // 清空所有图片按钮
        document.getElementById('clear-images').addEventListener('click', clearAllImages);
        
        // 添加示例图片按钮
        document.getElementById('add-sample-images').addEventListener('click', addSampleImages);
        
        // 发送邮件按钮
        document.getElementById('send-email').addEventListener('click', openSendModal);
        
        // 分享链接按钮
        document.getElementById('share-link').addEventListener('click', shareLink);
        
        // 重置所有内容按钮
        document.getElementById('reset-all').addEventListener('click', resetAllContent);
        
        // 切换音乐按钮
        document.getElementById('toggle-music').addEventListener('click', toggleBackgroundMusic);
        
        // 模态框按钮
        document.getElementById('cancel-send').addEventListener('click', closeSendModal);
        document.getElementById('confirm-send').addEventListener('click', sendEmail);
        
        // 实时保存情书内容
        document.getElementById('love-letter').addEventListener('input', debounce(saveToLocalStorage, 1000));
        
        // 实时保存发件人姓名
        document.getElementById('sender-name').addEventListener('input', debounce(saveToLocalStorage, 1000));
        
        // 实时保存收件人姓名
        document.getElementById('recipient-name').addEventListener('input', debounce(saveToLocalStorage, 1000));
    }
    
    // 防抖函数
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // 打印情书
    function printLetter() {
        // 创建打印内容
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>给最爱的你 - 情书</title>
                    <style>
                        body {
                            font-family: 'Georgia', serif;
                            line-height: 1.8;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 40px;
                        }
                        .letter-header {
                            text-align: right;
                            margin-bottom: 40px;
                            border-bottom: 2px solid #ff7eb9;
                            padding-bottom: 20px;
                        }
                        .letter-content {
                            font-size: 1.2rem;
                            white-space: pre-line;
                            margin-bottom: 40px;
                        }
                        .letter-footer {
                            text-align: right;
                            margin-top: 60px;
                        }
                        .signature {
                            font-family: 'Dancing Script', cursive;
                            font-size: 2.5rem;
                            color: #d63384;
                        }
                        .images-container {
                            margin-top: 40px;
                        }
                        .print-image {
                            max-width: 100%;
                            margin: 10px 0;
                            border-radius: 10px;
                        }
                        @media print {
                            body {
                                padding: 20px;
                            }
                            .no-print {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="letter-header">
                        <p>致：${document.getElementById('recipient-name').textContent}</p>
                        <p>日期：${document.getElementById('current-date').textContent}</p>
                    </div>
                    
                    <div class="letter-content">
                        ${document.getElementById('love-letter').value}
                    </div>
                    
                    <div class="letter-footer">
                        <p class="signature">永远爱你的，${document.getElementById('sender-name').textContent}</p>
                    </div>
                    
                    ${uploadedImages.length > 0 ? `
                    <div class="images-container">
                        <h3>我们的回忆</h3>
                        ${uploadedImages.map(img => `<img src="${img.dataUrl}" class="print-image" alt="我们的回忆">`).join('')}
                    </div>
                    ` : ''}
                    
                    <div class="no-print" style="margin-top: 40px; text-align: center; color: #999; font-size: 0.9rem;">
                        <p>这封情书是用爱制作的 ❤️</p>
                    </div>
                    
                    <script>
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `;
        
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
    
    // 更换信纸背景
    function changeLetterBackground() {
        currentBgIndex = (currentBgIndex + 1) % letterBackgrounds.length;
        document.querySelector('.letter-container').style.background = letterBackgrounds[currentBgIndex];
        showNotification('信纸已更换！');
    }
    
    // 处理图片上传
    function handleImageUpload(event) {
        const files = event.target.files;
        processImages(files);
    }
    
    // 处理拖拽上传
    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        document.getElementById('upload-area').style.borderColor = '#ff7eb9';
        document.getElementById('upload-area').style.backgroundColor = '#fff5f8';
    }
    
    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        
        document.getElementById('upload-area').style.borderColor = '#ffc1d6';
        document.getElementById('upload-area').style.backgroundColor = '#fff9fb';
        
        const files = event.dataTransfer.files;
        processImages(files);
    }
    
    // 处理图片
    function processImages(files) {
        // 限制最多10张图片
        if (uploadedImages.length + files.length > 10) {
            showNotification('最多只能上传10张图片！');
            return;
        }
        
        let processedCount = 0;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // 检查文件类型
            if (!file.type.match('image.*')) {
                continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                uploadedImages.push({
                    id: Date.now() + i,
                    dataUrl: e.target.result,
                    name: file.name
                });
                
                processedCount++;
                
                if (processedCount === Math.min(files.length, 10 - uploadedImages.length)) {
                    renderImageGallery();
                    saveToLocalStorage();
                    updatePreview();
                    showNotification(`成功上传${processedCount}张图片！`);
                }
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // 渲染图片库
    function renderImageGallery() {
        const gallery = document.getElementById('image-gallery');
        
        // 清除现有图片（除了模板）
        const existingItems = gallery.querySelectorAll('.gallery-item:not(.template)');
        existingItems.forEach(item => item.remove());
        
        // 添加图片
        uploadedImages.forEach((image, index) => {
            const template = document.querySelector('.gallery-item.template');
            const newItem = template.cloneNode(true);
            newItem.classList.remove('template');
            newItem.dataset.id = image.id;
            
            const img = newItem.querySelector('img');
            img.src = image.dataUrl;
            img.alt = `回忆图片 ${index + 1}`;
            
            // 删除按钮事件
            const deleteBtn = newItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteImage(image.id);
            });
            
            // 添加到信中按钮事件
            const addToLetterBtn = newItem.querySelector('.add-to-letter-btn');
            addToLetterBtn.addEventListener('click', function() {
                addImageToLetter(image.dataUrl);
            });
            
            gallery.appendChild(newItem);
        });
    }
    
    // 删除图片
    function deleteImage(id) {
        uploadedImages = uploadedImages.filter(img => img.id !== id);
        renderImageGallery();
        saveToLocalStorage();
        updatePreview();
        showNotification('图片已删除！');
    }
    
    // 清空所有图片
    function clearAllImages() {
        if (uploadedImages.length === 0) {
            showNotification('没有图片可清空！');
            return;
        }
        
        if (confirm('确定要清空所有图片吗？')) {
            uploadedImages = [];
            renderImageGallery();
            saveToLocalStorage();
            updatePreview();
            showNotification('所有图片已清空！');
        }
    }
    
    // 添加示例图片
    function addSampleImages() {
        // 使用一些占位图作为示例
        const sampleImages = [
            'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1529255484355-cb73c33c04bb?ixlib=rb-1.2.1&auto=format&fit=crop&w-600&q=80',
            'https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        ];
        
        // 检查是否会超过10张限制
        if (uploadedImages.length + sampleImages.length > 10) {
            showNotification('无法添加示例图片，图片数量将超过10张！');
            return;
        }
        
        // 添加示例图片
        sampleImages.forEach((url, index) => {
            uploadedImages.push({
                id: Date.now() + index,
                dataUrl: url,
                name: `示例图片 ${index + 1}`
            });
        });
        
        renderImageGallery();
        saveToLocalStorage();
        updatePreview();
        showNotification('示例图片已添加！');
    }
    
    // 添加图片到信中
    function addImageToLetter(dataUrl) {
        const letterTextarea = document.getElementById('love-letter');
        const cursorPos = letterTextarea.selectionStart;
        const textBefore = letterTextarea.value.substring(0, cursorPos);
        const textAfter = letterTextarea.value.substring(cursorPos);
        
        // 添加图片标记
        letterTextarea.value = textBefore + `\n[图片: ${dataUrl}]\n` + textAfter;
        
        // 保存并更新预览
        saveToLocalStorage();
        updatePreview();
        showNotification('图片已添加到信中！');
    }
    
    // 更新预览
    function updatePreview() {
        const previewContent = document.getElementById('preview-content');
        const letterText = document.getElementById('love-letter').value;
        const senderName = document.getElementById('sender-name').textContent;
        const recipientName = document.getElementById('recipient-name').textContent;
        
        // 解析文本中的图片标记
        const imageRegex = /\[图片: (.*?)\]/g;
        let formattedText = letterText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // 将图片标记替换为img标签
        formattedText = formattedText.replace(imageRegex, '<img src="$1" class="preview-image" alt="情书中的图片">');
        
        // 将换行符转换为br标签
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        // 构建预览HTML
        let previewHTML = `
            <div class="preview-letter">
                <p><strong>致：</strong>${recipientName}</p>
                <p><strong>日期：</strong>${document.getElementById('current-date').textContent}</p>
                <br>
                <div class="preview-text">${formattedText}</div>
                <br>
                <p class="preview-signature"><strong>永远爱你的，</strong>${senderName}</p>
            </div>
        `;
        
        // 如果有上传的图片，添加到预览
        if (uploadedImages.length > 0) {
            previewHTML += `<div class="preview-images"><h4>我们的回忆</h4><div class="preview-images-grid">`;
            
            uploadedImages.forEach(img => {
                previewHTML += `<img src="${img.dataUrl}" class="preview-image" alt="我们的回忆">`;
            });
            
            previewHTML += `</div></div>`;
        }
        
        previewContent.innerHTML = previewHTML;
    }
    
    // 打开发送模态框
    function openSendModal() {
        document.getElementById('send-modal').style.display = 'flex';
        document.getElementById('recipient-email').focus();
    }
    
    // 关闭发送模态框
    function closeSendModal() {
        document.getElementById('send-modal').style.display = 'none';
        document.getElementById('recipient-email').value = '';
    }
    
    // 发送邮件（模拟）
    function sendEmail() {
        const email = document.getElementById('recipient-email').value;
        
        if (!email || !email.includes('@')) {
            showNotification('请输入有效的邮箱地址！');
            return;
        }
        
        // 模拟发送过程
        showNotification(`正在发送情书到 ${email}...`);
        
        setTimeout(() => {
            closeSendModal();
            showNotification('情书已发送！请提醒她检查邮箱。');
            
            // 在实际应用中，这里应该调用后端API发送邮件
            // 由于这是静态网站，我们可以使用mailto链接作为备用方案
            const subject = '一封特别的情书';
            const body = `亲爱的${document.getElementById('recipient-name').textContent},\n\n${document.getElementById('love-letter').value}\n\n永远爱你的,\n${document.getElementById('sender-name').textContent}`;
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // 打开邮件客户端
            window.open(mailtoLink, '_blank');
        }, 2000);
    }
    
    // 分享链接
    function shareLink() {
        // 创建包含数据的URL
        const data = {
            letter: document.getElementById('love-letter').value,
            sender: document.getElementById('sender-name').textContent,
            recipient: document.getElementById('recipient-name').textContent,
            images: uploadedImages
        };
        
        // 在实际应用中，这里应该将数据保存到服务器并返回一个短链接
        // 由于这是静态网站，我们只能模拟这个过程
        const shareData = {
            title: '一封特别的情书',
            text: `查看${document.getElementById('sender-name').textContent}写给${document.getElementById('recipient-name').textContent}的情书`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => showNotification('分享成功！'))
                .catch(error => {
                    console.log('分享失败:', error);
                    copyToClipboard(window.location.href);
                });
        } else {
            // 如果不支持Web Share API，则复制链接到剪贴板
            copyToClipboard(window.location.href);
        }
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('链接已复制到剪贴板！');
    }
    
    // 重置所有内容
    function resetAllContent() {
        if (confirm('确定要重置所有内容吗？这将清除情书、图片和所有设置。')) {
            // 清除本地存储
            localStorage.clear();
            
            // 重置情书
            document.getElementById('love-letter').value = '';
            document.getElementById('sender-name').textContent = '我';
            document.getElementById('recipient-name').textContent = '我亲爱的女友';
            
            // 重置图片
            uploadedImages = [];
            renderImageGallery();
            
            // 重置背景
            currentBgIndex = 0;
            document.querySelector('.letter-container').style.background = letterBackgrounds[currentBgIndex];
            
            // 重置音乐
            isMusicPlaying = true;
            updateMusicButton();
            playBackgroundMusic();
            
            // 更新预览
            updatePreview();
            
            showNotification('所有内容已重置！');
        }
    }
    
    // 播放背景音乐
    function playBackgroundMusic() {
        const music = document.getElementById('background-music');
        if (isMusicPlaying) {
            music.volume = 0.3;
            music.play().catch(e => {
                console.log('自动播放被阻止，需要用户交互');
                // 如果自动播放被阻止，我们将在用户与页面交互后重新尝试
                document.addEventListener('click', function playOnInteraction() {
                    music.play();
                    document.removeEventListener('click', playOnInteraction);
                }, { once: true });
            });
        } else {
            music.pause();
        }
    }
    
    // 切换背景音乐
    function toggleBackgroundMusic() {
        isMusicPlaying = !isMusicPlaying;
        updateMusicButton();
        playBackgroundMusic();
        saveToLocalStorage();
    }
    
    // 更新音乐按钮
    function updateMusicButton() {
        const button = document.getElementById('toggle-music');
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (isMusicPlaying) {
            icon.className = 'fas fa-volume-up';
            text.textContent = '背景音乐: 开启';
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = '背景音乐: 关闭';
        }
    }
});