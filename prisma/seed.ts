import { PrismaClient, Role, SellerTier, ListingStatus, TransactionStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.savedListing.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tierConfig.deleteMany();
  await prisma.platformConfig.deleteMany();

  // Platform config
  await prisma.platformConfig.create({
    data: {
      commissionPercent: 5.0,
      featuredListingFee: 499,
      flatListingFee: 0,
    },
  });

  // Tier configs
  await prisma.tierConfig.createMany({
    data: [
      { tier: SellerTier.BRONZE, maxListings: 2, monthlyPrice: 0, featuredPerMonth: 0, description: "Free tier — list up to 2 memberships" },
      { tier: SellerTier.SILVER, maxListings: 10, monthlyPrice: 999, featuredPerMonth: 1, description: "Priority visibility & 1 featured listing/month" },
      { tier: SellerTier.GOLD, maxListings: 999, monthlyPrice: 2499, featuredPerMonth: 5, description: "Unlimited listings, analytics & premium badge" },
    ],
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Club Memberships", slug: "club-memberships", icon: "Crown", description: "Premium club and social memberships" } }),
    prisma.category.create({ data: { name: "Gym & Fitness", slug: "gym-fitness", icon: "Dumbbell", description: "Gym, fitness center, and wellness memberships" } }),
    prisma.category.create({ data: { name: "Holiday Packages", slug: "holiday-packages", icon: "Palmtree", description: "Holiday and vacation ownership packages" } }),
    prisma.category.create({ data: { name: "Resort Memberships", slug: "resort-memberships", icon: "Hotel", description: "Resort and hospitality memberships" } }),
    prisma.category.create({ data: { name: "Spa & Wellness", slug: "spa-wellness", icon: "Sparkles", description: "Spa, wellness, and beauty memberships" } }),
    prisma.category.create({ data: { name: "Co-working Spaces", slug: "co-working-spaces", icon: "Building2", description: "Co-working and office space memberships" } }),
    prisma.category.create({ data: { name: "Sports Clubs", slug: "sports-clubs", icon: "Trophy", description: "Sports, cricket, tennis, and golf club memberships" } }),
    prisma.category.create({ data: { name: "Swimming & Aquatics", slug: "swimming-aquatics", icon: "Waves", description: "Swimming pool and aquatic center memberships" } }),
  ]);

  const passwordHash = await hash("password123", 12);

  // Users
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@rememberx.in", passwordHash, role: Role.ADMIN, tier: SellerTier.GOLD, city: "Mumbai", state: "Maharashtra" },
  });

  const sellers = await Promise.all([
    prisma.user.create({ data: { name: "Rajesh Sharma", email: "rajesh@example.com", passwordHash, role: Role.SELLER, tier: SellerTier.GOLD, city: "Mumbai", state: "Maharashtra", phone: "+919876543210" } }),
    prisma.user.create({ data: { name: "Priya Patel", email: "priya@example.com", passwordHash, role: Role.SELLER, tier: SellerTier.SILVER, city: "Bangalore", state: "Karnataka", phone: "+919876543211" } }),
    prisma.user.create({ data: { name: "Amit Kumar", email: "amit@example.com", passwordHash, role: Role.SELLER, tier: SellerTier.BRONZE, city: "Delhi", state: "Delhi", phone: "+919876543212" } }),
    prisma.user.create({ data: { name: "Sneha Reddy", email: "sneha@example.com", passwordHash, role: Role.SELLER, tier: SellerTier.GOLD, city: "Hyderabad", state: "Telangana", phone: "+919876543213" } }),
    prisma.user.create({ data: { name: "Vikram Singh", email: "vikram@example.com", passwordHash, role: Role.SELLER, tier: SellerTier.SILVER, city: "Pune", state: "Maharashtra", phone: "+919876543214" } }),
  ]);

  const buyers = await Promise.all([
    prisma.user.create({ data: { name: "Ananya Gupta", email: "ananya@example.com", passwordHash, role: Role.BUYER, city: "Chennai", state: "Tamil Nadu" } }),
    prisma.user.create({ data: { name: "Rohan Mehta", email: "rohan@example.com", passwordHash, role: Role.BUYER, city: "Kolkata", state: "West Bengal" } }),
    prisma.user.create({ data: { name: "Kavita Joshi", email: "kavita@example.com", passwordHash, role: Role.BUYER, city: "Jaipur", state: "Rajasthan" } }),
    prisma.user.create({ data: { name: "Deepak Nair", email: "deepak@example.com", passwordHash, role: Role.BUYER, city: "Ahmedabad", state: "Gujarat" } }),
    prisma.user.create({ data: { name: "Meera Iyer", email: "meera@example.com", passwordHash, role: Role.BUYER, city: "Goa", state: "Goa" } }),
  ]);

  // Listings
  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        title: "Prestige Lakeside Club — Lifetime Family Membership",
        description: "Exclusive lifetime family membership at Prestige Lakeside Club, Mumbai. Includes access to swimming pool, tennis courts, banquet hall, and fine dining restaurant. Transferable with club approval. Original purchase was in 2019. All facilities recently renovated in 2024.",
        originalPrice: 1500000,
        askingPrice: 850000,
        city: "Mumbai",
        state: "Maharashtra",
        membershipType: "Lifetime",
        duration: "Lifetime",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: true,
        views: 342,
        categoryId: categories[0].id,
        sellerId: sellers[0].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Gold's Gym Koramangala — 2 Year Premium Membership",
        description: "Premium Gold's Gym membership with access to all equipment, group classes (Zumba, Yoga, CrossFit), personal trainer sessions (2/month), sauna, and steam room. Valid at all Bangalore locations. 18 months remaining.",
        originalPrice: 65000,
        askingPrice: 38000,
        city: "Bangalore",
        state: "Karnataka",
        membershipType: "Annual",
        duration: "18 months remaining",
        expiryDate: new Date("2027-09-15"),
        images: [
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: true,
        views: 218,
        categoryId: categories[1].id,
        sellerId: sellers[1].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Club Mahindra Holiday Package — 25 Years Remaining",
        description: "Club Mahindra Purple season membership with 25 years remaining. Entitles 1 week stay per year at any Club Mahindra resort across India (Goa, Munnar, Manali, Coorg, etc.). Can be upgraded to Blue season. Includes RCI exchange for international holidays.",
        originalPrice: 750000,
        askingPrice: 420000,
        city: "Delhi",
        state: "Delhi",
        membershipType: "Long-term",
        duration: "25 years remaining",
        expiryDate: new Date("2051-03-20"),
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: true,
        views: 567,
        categoryId: categories[2].id,
        sellerId: sellers[2].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Sterling Holidays Resort Membership — Goa & Kerala",
        description: "Sterling Holidays membership with access to Goa Varca, Goa Bardez, and Kerala Munnar resorts. 2 weeks accommodation per year. Includes access to all resort amenities. Membership is for 20 more years.",
        originalPrice: 500000,
        askingPrice: 275000,
        city: "Hyderabad",
        state: "Telangana",
        membershipType: "Long-term",
        duration: "20 years remaining",
        expiryDate: new Date("2046-06-10"),
        images: [
          "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800",
          "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 189,
        categoryId: categories[3].id,
        sellerId: sellers[3].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "O2 Spa Platinum Annual Pass — All India",
        description: "O2 Spa Platinum Pass valid across all O2 Spa locations in India. Unlimited massages and spa treatments for 1 year. Currently 8 months remaining. Includes couple sessions and access to premium treatments.",
        originalPrice: 85000,
        askingPrice: 45000,
        city: "Pune",
        state: "Maharashtra",
        membershipType: "Annual",
        duration: "8 months remaining",
        expiryDate: new Date("2026-11-30"),
        images: [
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
          "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800",
          "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 145,
        categoryId: categories[4].id,
        sellerId: sellers[4].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "WeWork All Access — 6 Months Remaining",
        description: "WeWork All Access membership with 6 months remaining. Access any WeWork location across India — Mumbai (BKC, Andheri), Delhi (CP, Gurgaon), Bangalore (Koramangala, Whitefield). Includes hot desks, meeting rooms (10hrs/month), and community events.",
        originalPrice: 180000,
        askingPrice: 95000,
        city: "Mumbai",
        state: "Maharashtra",
        membershipType: "Monthly",
        duration: "6 months remaining",
        expiryDate: new Date("2026-09-01"),
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
          "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: true,
        views: 298,
        categoryId: categories[5].id,
        sellerId: sellers[0].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Bombay Gymkhana — Annual Sports Membership",
        description: "Annual sports membership at the prestigious Bombay Gymkhana. Includes cricket nets, tennis courts, swimming pool, billiards room, and access to the iconic clubhouse restaurant. 10 months remaining on current term.",
        originalPrice: 200000,
        askingPrice: 135000,
        city: "Mumbai",
        state: "Maharashtra",
        membershipType: "Annual",
        duration: "10 months remaining",
        expiryDate: new Date("2027-01-15"),
        images: [
          "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
          "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 412,
        categoryId: categories[6].id,
        sellerId: sellers[0].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Talkatora Swimming Complex — Family Annual Pass",
        description: "Family annual pass for Talkatora Swimming Complex, Delhi. Access to Olympic-size pool, kids pool, and training area. Valid for family of 4. Great for regular swimmers. 9 months remaining.",
        originalPrice: 24000,
        askingPrice: 14000,
        city: "Delhi",
        state: "Delhi",
        membershipType: "Annual",
        duration: "9 months remaining",
        expiryDate: new Date("2026-12-31"),
        images: [
          "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800",
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
          "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 87,
        categoryId: categories[7].id,
        sellerId: sellers[2].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Cult.fit Unlimited — Bangalore All Centers",
        description: "Cult.fit Unlimited membership covering all Bangalore centers. Group classes (yoga, dance, boxing, strength), gym access, and cult.sport benefits. Personal training add-on included. 14 months left.",
        originalPrice: 48000,
        askingPrice: 28000,
        city: "Bangalore",
        state: "Karnataka",
        membershipType: "Annual",
        duration: "14 months remaining",
        expiryDate: new Date("2027-05-20"),
        images: [
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
          "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800",
          "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 203,
        categoryId: categories[1].id,
        sellerId: sellers[1].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Bengaluru Club — Lifetime Individual Membership",
        description: "Lifetime individual membership at the historic Bengaluru Club (est. 1868). One of the most prestigious clubs in South India. Includes access to all facilities — library, bar, dining, sports grounds, swimming pool, and guest rooms. Transferable with board approval.",
        originalPrice: 2500000,
        askingPrice: 1800000,
        city: "Bangalore",
        state: "Karnataka",
        membershipType: "Lifetime",
        duration: "Lifetime",
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: true,
        views: 634,
        categoryId: categories[0].id,
        sellerId: sellers[3].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "Mahindra Holidays — Zest Season Membership",
        description: "Mahindra Holidays Zest season membership valid for 15 more years. 1 week stay annually at any Mahindra resort. Access to over 100+ resorts across India and international destinations through RCI. Perfect for family vacations.",
        originalPrice: 350000,
        askingPrice: 180000,
        city: "Chennai",
        state: "Tamil Nadu",
        membershipType: "Long-term",
        duration: "15 years remaining",
        expiryDate: new Date("2041-08-15"),
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 321,
        categoryId: categories[2].id,
        sellerId: sellers[4].id,
      },
    }),
    prisma.listing.create({
      data: {
        title: "91Springboard Co-working — Annual Dedicated Desk",
        description: "Annual dedicated desk pass at 91Springboard, Koramangala, Bangalore. Includes 24/7 access, high-speed WiFi, meeting room credits (20hrs/month), locker, printing, and community events. 7 months left on contract.",
        originalPrice: 144000,
        askingPrice: 72000,
        city: "Bangalore",
        state: "Karnataka",
        membershipType: "Annual",
        duration: "7 months remaining",
        expiryDate: new Date("2026-10-01"),
        images: [
          "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
        ],
        status: ListingStatus.ACTIVE,
        featured: false,
        views: 156,
        categoryId: categories[5].id,
        sellerId: sellers[1].id,
      },
    }),
  ]);

  // Transactions (completed ones)
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        amount: 38000,
        commission: 1900,
        status: TransactionStatus.COMPLETED,
        listingId: listings[1].id,
        buyerId: buyers[0].id,
        sellerId: sellers[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 14000,
        commission: 700,
        status: TransactionStatus.COMPLETED,
        listingId: listings[7].id,
        buyerId: buyers[1].id,
        sellerId: sellers[2].id,
      },
    }),
    prisma.transaction.create({
      data: {
        amount: 45000,
        commission: 2250,
        status: TransactionStatus.COMPLETED,
        listingId: listings[4].id,
        buyerId: buyers[2].id,
        sellerId: sellers[4].id,
      },
    }),
  ]);

  // Reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Excellent deal! The gym membership transfer was seamless. Priya was very helpful throughout the process.",
        buyerId: buyers[0].id,
        sellerId: sellers[1].id,
        listingId: listings[1].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Good value for money. The swimming pass works perfectly. Transfer took about a week but worth the wait.",
        buyerId: buyers[1].id,
        sellerId: sellers[2].id,
        listingId: listings[7].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Amazing spa membership at a fraction of the price. Vikram was responsive and honest about the terms. Highly recommended!",
        buyerId: buyers[2].id,
        sellerId: sellers[4].id,
        listingId: listings[4].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Rajesh made the club membership transfer very smooth. Great facilities and the price was fair.",
        buyerId: buyers[3].id,
        sellerId: sellers[0].id,
        listingId: listings[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "The holiday package is incredible value. 25 years of holidays at this price is unbeatable. Thank you!",
        buyerId: buyers[4].id,
        sellerId: sellers[2].id,
        listingId: listings[2].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 3,
        comment: "Decent deal but the transfer process took longer than expected. Communication could have been better.",
        buyerId: buyers[0].id,
        sellerId: sellers[3].id,
        listingId: listings[3].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Top-notch experience. Sneha was very professional and the resort membership details were exactly as described.",
        buyerId: buyers[1].id,
        sellerId: sellers[3].id,
        listingId: listings[9].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "WeWork membership at a great discount. All access as promised. Rajesh is a reliable seller.",
        buyerId: buyers[3].id,
        sellerId: sellers[0].id,
        listingId: listings[5].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Fantastic co-working space and a genuine listing. Priya made the process effortless.",
        buyerId: buyers[4].id,
        sellerId: sellers[1].id,
        listingId: listings[11].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Good gym, transferred without issues. Cult.fit membership is working great.",
        buyerId: buyers[2].id,
        sellerId: sellers[1].id,
        listingId: listings[8].id,
      },
    }),
  ]);

  // Saved listings
  await Promise.all([
    prisma.savedListing.create({ data: { userId: buyers[0].id, listingId: listings[0].id } }),
    prisma.savedListing.create({ data: { userId: buyers[0].id, listingId: listings[2].id } }),
    prisma.savedListing.create({ data: { userId: buyers[1].id, listingId: listings[5].id } }),
    prisma.savedListing.create({ data: { userId: buyers[2].id, listingId: listings[9].id } }),
    prisma.savedListing.create({ data: { userId: buyers[3].id, listingId: listings[3].id } }),
    prisma.savedListing.create({ data: { userId: buyers[4].id, listingId: listings[6].id } }),
  ]);

  console.log("Seed complete!");
  console.log(`Created: ${categories.length} categories, ${sellers.length + buyers.length + 1} users, ${listings.length} listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
