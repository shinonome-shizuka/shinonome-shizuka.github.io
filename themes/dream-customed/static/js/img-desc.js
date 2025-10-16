// 图片描述交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 为所有图片容器添加交互功能
    initImageDescription();
});

function initImageDescription() {
    // 获取所有文章内容中的图片
    const mainContent = document.querySelector('.dream-single .main');
    if (!mainContent) return;

    const images = mainContent.querySelectorAll('img');

    images.forEach(img => {
        // 跳过已经包装过的图片
        if (img.closest('.img-container')) return;

        // 创建图片容器（所有图片都会被包装）
        const container = createImageContainer(img);

        // 尝试从图片alt属性或data-desc属性获取描述
        const description = img.getAttribute('data-desc') || img.getAttribute('alt') || '';

        if (description) {
            addDescriptionToggle(container, description);

            // 只为有描述的图片添加点击事件
            img.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDescription(container);
            });
        }
    });
}

function createImageContainer(img) {
    // 如果已经有容器则返回
    if (img.closest('.img-container')) {
        return img.closest('.img-container');
    }

    // 创建容器
    const container = document.createElement('div');
    container.className = 'img-container';

    // 包装图片
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);

    return container;
}

function addDescriptionToggle(container, description) {
    // 检查是否已经有描述
    if (container.querySelector('.img-desc')) return;

    // 创建描述元素
    const descElement = document.createElement('div');
    descElement.className = 'img-desc';
    descElement.textContent = description;

    // 创建切换按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'img-desc-toggle';
    toggleBtn.innerHTML = 'i';
    toggleBtn.title = '显示/隐藏图片描述';

    // 添加到容器
    container.appendChild(descElement);
    container.appendChild(toggleBtn);

    // 为切换按钮添加事件
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDescription(container);
    });
}

function toggleDescription(container) {
    const desc = container.querySelector('.img-desc');
    if (!desc) return;

    const isExpanded = desc.classList.contains('expanded');

    if (isExpanded) {
        desc.classList.remove('expanded');
        container.classList.remove('img-desc-open'); // 移除打开状态的类
    } else {
        desc.classList.add('expanded');
        container.classList.add('img-desc-open'); // 添加打开状态的类
    }

    // 更新切换按钮的文本
    const toggleBtn = container.querySelector('.img-desc-toggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = isExpanded ? 'i' : '−';
    }
}

// 支持手动初始化（用于动态加载的内容）
window.initImageDescriptions = initImageDescription;