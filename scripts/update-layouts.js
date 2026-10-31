const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Helper to update a file
function updateFile(relPath, fn) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', relPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const nl = isCrlf ? '\r\n' : '\n';
  const updated = fn(content, nl);
  if (updated !== content) {
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log('Updated:', relPath);
  } else {
    console.log('No change needed or pattern not found:', relPath);
  }
}

// 1. Farmer Dashboard
updateFile('src/app/farmer/dashboard/page.tsx', (c, nl) => {
  if (!c.includes('DashboardNav')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';${nl}import { DashboardNav } from '@/components/common/DashboardNav';`
    );
    c = c.replace(
      `<Navbar />`,
      `<Navbar />${nl}      <DashboardNav role="farmer" badgeCounts={{ listings: totalActiveLots, offers: totalOffersCount, visits: confirmedVisitsCount, notifications: notifications.length }} />`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 2. Seller Dashboard
updateFile('src/app/seller/dashboard/page.tsx', (c, nl) => {
  if (!c.includes('DashboardNav')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';${nl}import { DashboardNav } from '@/components/common/DashboardNav';`
    );
    c = c.replace(
      `<Navbar />`,
      `<Navbar />${nl}      <DashboardNav role="seller" />`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 3. Marketplace
updateFile('src/app/marketplace/page.tsx', (c, nl) => {
  if (!c.includes('PageHeader')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';${nl}import { PageHeader } from '@/components/common/PageHeader';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 4. Visits
updateFile('src/app/visits/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 5. Farmer Offers
updateFile('src/app/farmer/offers/page.tsx', (c, nl) => {
  if (!c.includes('DashboardNav')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';${nl}import { DashboardNav } from '@/components/common/DashboardNav';`
    );
    c = c.replace(
      `<Navbar />`,
      `<Navbar />${nl}      <DashboardNav role="farmer" />`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 6. Farmer Add Crop
updateFile('src/app/farmer/add-crop/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 7. Help
updateFile('src/app/help/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 8. Notifications
updateFile('src/app/notifications/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 9. Farmer Listings Detail
updateFile('src/app/farmer/listings/[id]/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

// 10. Seller Listings Detail
updateFile('src/app/seller/listings/[id]/page.tsx', (c, nl) => {
  if (!c.includes('Footer')) {
    c = c.replace(
      `import { Navbar } from '@/components/common/Navbar';`,
      `import { Navbar } from '@/components/common/Navbar';${nl}import { Footer } from '@/components/common/Footer';${nl}import { BottomNav } from '@/components/common/BottomNav';`
    );
  }
  c = c.replace(
    `px-4 sm:px-6 lg:px-8 py-8 space-y-8`,
    `px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12 space-y-8`
  );
  if (!c.includes('<Footer />')) {
    c = c.replace(
      `</main>${nl}    </div>`,
      `</main>${nl}      <Footer />${nl}      <BottomNav />${nl}    </div>`
    );
  }
  return c;
});

console.log('Layout updates script finished execution.');
