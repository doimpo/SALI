/**
 * Dropdown Menu Test Script
 * Copy and paste this into your browser console to test dropdowns
 * 
 * Usage:
 * 1. Open your website (public/index.html)
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 */

console.log('🔍 Testing Dropdown Menus...\n');

// Test 1: Check if dropdown elements exist
const dropdownParents = $('.nav__item.has-dropdown');
const dropdownMenus = $('.dropdown-menu');

console.log('✅ Test 1: Element Detection');
console.log(`   Found ${dropdownParents.length} dropdown parent elements`);
console.log(`   Found ${dropdownMenus.length} dropdown menu elements`);

if (dropdownParents.length === 0) {
  console.error('❌ ERROR: No dropdown elements found! Check HTML structure.');
  console.log('   Expected: Elements with class "nav__item has-dropdown"');
}

// Test 2: Check viewport width
const viewportWidth = $(window).width();
console.log('\n✅ Test 2: Viewport Size');
console.log(`   Current width: ${viewportWidth}px`);
console.log(`   Mode: ${viewportWidth >= 992 ? 'DESKTOP' : 'MOBILE'}`);

if (viewportWidth >= 992) {
  console.log('   📱 Desktop mode - Hover should work');
  
  // Test 3: Check initial CSS state
  if (dropdownMenus.length > 0) {
    const firstDropdown = dropdownMenus.first();
    console.log('\n✅ Test 3: Initial CSS State (First Dropdown)');
    console.log('   display:', firstDropdown.css('display'));
    console.log('   opacity:', firstDropdown.css('opacity'));
    console.log('   visibility:', firstDropdown.css('visibility'));
    console.log('   position:', firstDropdown.css('position'));
    console.log('   z-index:', firstDropdown.css('z-index'));
    
    // Expected values
    const expected = {
      display: 'block',
      opacity: '0',
      visibility: 'hidden',
      position: 'absolute'
    };
    
    const actual = {
      display: firstDropdown.css('display'),
      opacity: firstDropdown.css('opacity'),
      visibility: firstDropdown.css('visibility'),
      position: firstDropdown.css('position')
    };
    
    console.log('\n   Expected vs Actual:');
    Object.keys(expected).forEach(key => {
      const match = actual[key] === expected[key];
      console.log(`   ${match ? '✅' : '❌'} ${key}: ${actual[key]} ${match ? '(correct)' : `(should be ${expected[key]})`}`);
    });
  }
  
  // Test 4: Simulate hover
  console.log('\n✅ Test 4: Simulating Hover...');
  const testDropdown = dropdownParents.first();
  
  if (testDropdown.length > 0) {
    console.log('   Triggering mouseenter on first dropdown...');
    testDropdown.trigger('mouseenter');
    
    setTimeout(() => {
      const menu = testDropdown.find('.dropdown-menu');
      console.log('\n   After Hover:');
      console.log('   display:', menu.css('display'));
      console.log('   opacity:', menu.css('opacity'));
      console.log('   visibility:', menu.css('visibility'));
      
      const visible = menu.css('opacity') === '1' && menu.css('visibility') === 'visible';
      console.log(`\n   ${visible ? '✅ DROPDOWN IS VISIBLE!' : '❌ DROPDOWN NOT VISIBLE'}`);
      
      if (!visible) {
        console.log('\n   ⚠️ Checking for overriding styles...');
        console.log('   Please check Elements tab → Styles panel for:');
        console.log('   - Conflicting CSS rules');
        console.log('   - Missing !important flags');
        console.log('   - Higher specificity selectors');
      }
      
      // Clean up - remove hover
      testDropdown.trigger('mouseleave');
    }, 100);
  }
  
} else {
  console.log('   📱 Mobile mode - Click should work');
  console.log('   ⚠️ Hover tests skipped in mobile mode');
}

// Test 5: Check CSS file loading
console.log('\n✅ Test 5: CSS File Loading');
fetch('assets/css/style.css', { method: 'HEAD' })
  .then(response => {
    console.log(`   style.css: ${response.ok ? '✅ Loaded' : '❌ Not found'} (${response.status})`);
  })
  .catch(err => console.error('   style.css: ❌ Error loading'));

fetch('assets/css/sali-custom.css', { method: 'HEAD' })
  .then(response => {
    console.log(`   sali-custom.css: ${response.ok ? '✅ Loaded' : '❌ Not found'} (${response.status})`);
  })
  .catch(err => console.error('   sali-custom.css: ❌ Error loading'));

// Test 6: List all dropdown menu items
console.log('\n✅ Test 6: Dropdown Menu Items');
dropdownParents.each(function(index) {
  const menuName = $(this).find('.nav__item-link').first().text().trim();
  const submenuCount = $(this).find('.dropdown-menu > .nav__item').length;
  console.log(`   ${index + 1}. ${menuName} (${submenuCount} submenu items)`);
});

// Final instructions
console.log('\n📋 Manual Test Instructions:');
console.log('   1. Hover over "About" menu item');
console.log('   2. Watch for dropdown to appear');
console.log('   3. If dropdown appears: ✅ SUCCESS!');
console.log('   4. If dropdown does NOT appear:');
console.log('      - Check Elements tab → Inspect .dropdown-menu');
console.log('      - Look at Computed styles');
console.log('      - Check for opacity: 1 and visibility: visible on hover');
console.log('      - Look for any red strikethrough styles (overridden)');

console.log('\n🎯 Test Complete!\n');

