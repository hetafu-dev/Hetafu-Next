"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
// import YouMayAlsoLike from "@/app/Components/Common/YouMayAlsoLike/Page";
import dynamic from "next/dynamic";
import ProductImage from "@/app/Components/Products/ProductImage";
import { slugToCategoryKey, CATEGORY_CONFIG } from "@/constants/categoryConfig";
import { fetchProductBySlug } from "@/services/productService";
import { fetchProductReviews } from "@/services/reviewService";
import { resolveProductImages, getImageFallback } from "@/utils/productImages";
import {
  resolvePackPrice,
  getDefaultPackId,
  getPackOption,
  getPackOptionsForVariant,
} from "@/utils/packOptions";
import { isMongoObjectId } from "@/utils/cartUtils";

const CategoryProductDetailPage = dynamic(
  () => import("@/app/Components/Products/CategoryProductDetailPage"),
  {
    loading: () => (
      <div className="flex flex-col min-h-screen items-center justify-center text-primary-brown min-h-[50vh]">
        Loading product...
      </div>
    ),
  },
);

const ALL_PRODUCTS = {
  pops: {
    id: 1,
    name: "Dollipops",
    category: "POPS",
    price: 75.0,
    rating: 4.7,
    reviewCount: 347,
    description:
      "Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home. These advanced strips use a safe, enamel-friendly formula that effectively removes stains from coffee, wine, and tobacco, revealing a brighter, whiter smile in just 2 weeks.",
    variants: ["Green Apple", "Mixed Berry"],
    variantLabel: "Flavour",
    images: [
      "/Images/Products/Dollipops/Dollipop.png",
      "/Images/Products/Dollipops/Dollipop1.png",
      "/Images/Products/Dollipops/Dollipop2.png",
      "/Images/Products/Dollipops/Dollipop3.png",
      "/Images/Products/Dollipops/Dollipop4.png",
    ],
    accordion: {
      details:
        "This delightful fragrance brings together vibrant fruity notes of raspberry and pear, blended with creamy vanilla and a hint of caramel.",
      ingredients:
        "ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), BENZYL SALICYLATE, LIMONENE, COUMARIN, LINALOOL, BENZYL BENZOATE, CITRAL, GERANIOL.",
      "how-to-use": [
        "Spray on pulse points: wrists, neck, and behind the ears",
        "Apply to freshly moisturized skin for longer lasting scent",
        "Keep away from direct sunlight and heat",
        "Store in a cool, dry place",
      ],
    },
    sectionImage: "/Images/Products/Dollipops/Dollipopsection2.png",
    sectionTitle: ["A Decade", "in the making"],
    sectionBody:
      "Our Mediterranean-inspired signature scent has inspired requests for a perfume since the beginning. After years of development and countless iterations, our iconic fragrance is now available in an eau de parfum.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Postcards From", "puglia"],
    postcardBody:
      "When the time came to bring Dollipops to life, Puglia, Italy was chosen as the perfect backdrop. With its wildflower cliffs and sparkling turquoise seas, it's a true manifestation of the wild Mediterranean vistas that inspired the fragrance.",
    postcardQuote:
      '"It kind of transported me back home—just feeling fresh and being in summer," said campaign star Adria Arjona.',
    notes: [
      {
        label: "top",
        description: "sweet violet · blooming jasmine · soft citrus",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "mid",
        description: "black pepper · velvet woods · clove vanilla",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "base",
        description: "silky sandalwood · shimmery musk · spicy amber",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dorothy M.",
        initials: "DM",
        avatarColor: "#d4b896",
        rating: 5,
        date: "06/11/24",
        title: "LOVE IT",
        body: "These whitening strips are amazing! I noticed a difference after just a few uses. My teeth are noticeably whiter and the application process is so easy.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Sally T.",
        initials: "ST",
        avatarColor: "#b8c9a3",
        rating: 4,
        date: "06/01/24",
        title: "HAPPY",
        body: "Ordered these whitening strips for my daughter, she loves them! We were both impressed with the results after 2 weeks of use.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Laura W.",
        initials: "LW",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/29/24",
        title: "LOVE THE RESULTS",
        body: "I've tried many whitening products and these are by far the best. They work gently without causing any sensitivity.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Ashleigh C.",
        initials: "AC",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "03/23/24",
        title: "THE BEST",
        body: "My favorite whitening product of all time 💕 absolutely love the results I always get compliments on how white my smile is.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Dominique L.",
        initials: "DL",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "03/13/24",
        title: "GREAT PRODUCT",
        body: "I love that these strips are easy to use and actually deliver on their promises. My teeth are noticeably whiter.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  bits: {
    id: 2,
    name: "Dentabits",
    category: "BITS",
    price: 45.0,
    rating: 4.8,
    reviewCount: 256,
    description:
      "Introducing Dentabits - our revolutionary whitening bits that transform your oral care routine. These eco-friendly, dissolvable bits pack a powerful punch of natural enamel-safe ingredients that remove surface stains while freshening breath. Perfect for travel and daily use.",
    variants: ["Default"],
    variantLabel: "Pack",
    images: [
      "https://uk.moroccanoil.com/cdn/shop/files/FRAGRANCE_EDP_100ml_2025UPDATE.jpg?v=1740380007&width=1946",
      "https://uk.moroccanoil.com/cdn/shop/files/FRAGRANCE_EDP_100ml_2025UPDATE.jpg?v=1740380007&width=1946",
    ],
    accordion: {
      details:
        "Dentabits are compact, dissolvable oral care tablets packed with enamel-safe whitening minerals and breath-freshening actives.",
      ingredients:
        "XYLITOL, SODIUM BICARBONATE, CALCIUM CARBONATE, MAGNESIUM STEARATE, SPEARMINT OIL, PEPPERMINT OIL, STEVIA LEAF EXTRACT.",
      "how-to-use": [
        "Pop one bit in your mouth and let it dissolve",
        "Brush teeth as normal for 2 minutes",
        "Rinse thoroughly",
        "Use twice daily for best results",
      ],
    },
    sectionImage: "/Images/Products/CUTE/cutebits.png",
    sectionTitle: ["Years of Research", "in every bit"],
    sectionBody:
      "After years of research and development, we created Dentabits to revolutionize oral care. Our dissolvable whitening bits combine natural ingredients with advanced technology to deliver professional-level results from the comfort of your home.",
    postcardImage: "/Images/Products/CUTE/cutepowder.png",
    postcardTitle: ["Inspired By", "nature"],
    postcardBody:
      "Dentabits was born from a desire to make oral care sustainable and effective. Every ingredient is sourced responsibly, and our zero-plastic packaging means you can care for your smile while caring for the planet.",
    postcardQuote:
      '"Dentabits represents the future of oral care - effective, convenient, and environmentally responsible." — Dr. Amanda Chen',
    notes: [
      {
        label: "natural",
        description: "fluoride free · eco-friendly · cruelty free",
        image: "/Images/Products/CUTE/cutebits.png",
      },
      {
        label: "whitening",
        description: "polishing minerals · enamel safe · stain removal",
        image: "/Images/Products/CUTE/cutepowder.png",
      },
      {
        label: "fresh",
        description: "long lasting · minty cool · alcohol free",
        image: "/Images/Products/CUTE/cutebits.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Sarah J.",
        initials: "SJ",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "AMAZING RESULTS",
        body: "I've been using Dentabits for two weeks and my teeth are noticeably whiter. The bits are so convenient for travel.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Mike T.",
        initials: "MT",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "CONVENIENT & EFFECTIVE",
        body: "As someone who travels frequently, these bits are a game-changer. No more bulky toothpaste tubes.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Emma W.",
        initials: "EW",
        avatarColor: "#c9b0b0",
        rating: 4,
        date: "03/20/24",
        title: "LOVE THE ECO-FRIENDLY ASPECT",
        body: "Finally, a toothpaste alternative that's good for the planet! The dissolvable bits eliminate plastic waste.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Lisa C.",
        initials: "LC",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/15/24",
        title: "MY NEW FAVORITE",
        body: "Dentabits has completely converted me. My dentist even commented on how much cleaner my teeth look!",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "David L.",
        initials: "DL",
        avatarColor: "#d4c4a8",
        rating: 5,
        date: "01/30/24",
        title: "WORTH EVERY PENNY",
        body: "The whitening effects are real. After a month of use, coffee and wine stains have significantly reduced.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  cute: {
    id: 3,
    name: "Cute Mouthwash",
    category: "CUTE",
    price: 35.0,
    rating: 4.6,
    reviewCount: 189,
    description:
      "Introducing Cute - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly formula is perfect for the whole family, with zero harsh chemicals and a deliciously sweet mint flavour.",
    variants: ["Sweet Mint", "Bubblegum"],
    variantLabel: "Flavour",
    images: [
      "/Images/Products/CUTE/cutebits.png",
      "/Images/Products/CUTE/cutepowder.png",
    ],
    accordion: {
      details:
        "Cute is our alcohol-free oral care formula designed for the whole family. Gentle on sensitive gums, tough on bad breath.",
      ingredients:
        "AQUA (WATER), XYLITOL, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, SPEARMINT OIL, SODIUM BENZOATE, CITRIC ACID, STEVIA REBAUDIANA LEAF EXTRACT.",
      "how-to-use": [
        "Measure 10ml and swish for 30 seconds",
        "Spit and do not rinse with water",
        "Use after brushing morning and night",
        "Safe for children aged 6 and above",
      ],
    },
    sectionImage: "/Images/Products/CUTE/cutebits.png",
    sectionTitle: ["Gentle on everyone", "in the family"],
    sectionBody:
      "Our alcohol-free formula was developed with families in mind. No harsh chemicals, no burning sensation - just fresh, clean breath that lasts all day. Perfect for kids and adults with sensitive gums.",
    postcardImage: "/Images/Products/CUTE/cutepowder.png",
    postcardTitle: ["Made For", "every smile"],
    postcardBody:
      "When we created Cute, we wanted a product that brought families together. Our formula has become a staple in households across the world, making oral care simple and enjoyable for everyone.",
    postcardQuote:
      '"It transformed our morning routine - even the kids ask to use it." — Happy Mom, Chicago',
    notes: [
      {
        label: "natural mint",
        description: "refreshing · cooling · invigorating",
        image: "/Images/Products/CUTE/cutebits.png",
      },
      {
        label: "xylitol",
        description: "tooth-friendly · natural sweetener",
        image: "/Images/Products/CUTE/cutepowder.png",
      },
      {
        label: "aloe vera",
        description: "soothing · gentle · healing",
        image: "/Images/Products/CUTE/cutebits.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Jennifer K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/22/24",
        title: "KIDS LOVE IT!",
        body: "Finally a formula my kids actually want to use! The cute packaging and mild mint flavour make their morning routine so much easier.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Maria S.",
        initials: "MS",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/18/24",
        title: "GENTLE ON SENSITIVE GUMS",
        body: "I've always struggled with sensitive gums, but this alcohol-free formula is amazing. No burning sensation, just fresh breath.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 4,
        date: "03/30/24",
        title: "GOOD VALUE",
        body: "Great value for money and the natural ingredients make me feel good about what I'm giving my family.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/14/24",
        title: "ECO-FRIENDLY PACKAGING",
        body: "Love that it's good for the planet too. The product works great!",
        helpful: 3,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 5,
        date: "01/25/24",
        title: "FRESH BREATH ALL DAY",
        body: "I use this twice a day and my breath stays fresh literally all day. Highly recommend!",
        helpful: 2,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  "cute-powder": {
    id: 7,
    name: "Powder",
    category: "CUTE",
    price: 35.0,
    rating: 4.6,
    reviewCount: 189,
    description:
      "Introducing Cute - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly formula is perfect for the whole family, with zero harsh chemicals and a deliciously sweet mint flavour.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/CUTE/cutepowder.png",
      "/Images/Products/CUTE/cutepowder1.png",
      "/Images/Products/CUTE/cutepowder2.png",
      "/Images/Products/CUTE/cutepowder3.png",
      "/Images/Products/CUTE/cutepowder4.png",
    ],
    accordion: {
      details:
        "Cute is our alcohol-free oral care formula designed for the whole family. Gentle on sensitive gums, tough on bad breath.",
      ingredients:
        "AQUA (WATER), XYLITOL, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, SPEARMINT OIL, SODIUM BENZOATE, CITRIC ACID, STEVIA REBAUDIANA LEAF EXTRACT.",
      "how-to-use": [
        "Measure 10ml and swish for 30 seconds",
        "Spit and do not rinse with water",
        "Use after brushing morning and night",
        "Safe for children aged 6 and above",
      ],
    },
    sectionImage: "/Images/Products/CUTE/cutepowder.png",
    sectionTitle: ["Gentle on everyone", "in the family"],
    sectionBody:
      "Our alcohol-free formula was developed with families in mind. No harsh chemicals, no burning sensation - just fresh, clean breath that lasts all day. Perfect for kids and adults with sensitive gums.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Made For", "every smile"],
    postcardBody:
      "When we created Cute, we wanted a product that brought families together. Our formula has become a staple in households across the world, making oral care simple and enjoyable for everyone.",
    postcardQuote:
      '"It transformed our morning routine - even the kids ask to use it." — Happy Mom, Chicago',
    notes: [
      {
        label: "natural mint",
        description: "refreshing · cooling · invigorating",
        image: "/Images/Products/CUTE/cutepowder.png",
      },
      {
        label: "xylitol",
        description: "tooth-friendly · natural sweetener",
        image: "/Images/Products/CUTE/cutepowder.png",
      },
      {
        label: "aloe vera",
        description: "soothing · gentle · healing",
        image: "/Images/Products/CUTE/cutepowder.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Jennifer K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/22/24",
        title: "KIDS LOVE IT!",
        body: "Finally a formula my kids actually want to use! The cute packaging and mild mint flavour make their morning routine so much easier.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Maria S.",
        initials: "MS",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/18/24",
        title: "GENTLE ON SENSITIVE GUMS",
        body: "I've always struggled with sensitive gums, but this alcohol-free formula is amazing. No burning sensation, just fresh breath.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 4,
        date: "03/30/24",
        title: "GOOD VALUE",
        body: "Great value for money and the natural ingredients make me feel good about what I'm giving my family.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/14/24",
        title: "ECO-FRIENDLY PACKAGING",
        body: "Love that it's good for the planet too. The product works great!",
        helpful: 3,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 5,
        date: "01/25/24",
        title: "FRESH BREATH ALL DAY",
        body: "I use this twice a day and my breath stays fresh literally all day. Highly recommend!",
        helpful: 2,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  "cute-tablets": {
    id: 8,
    name: "Tablets",
    category: "CUTE",
    price: 299.0,
    rating: 4.6,
    reviewCount: 189,
    description:
      "Introducing Cute - our gentle, alcohol-free formula that leaves your breath fresh and your mouth feeling clean all day long. Infused with natural mint and xylitol, this kid-friendly formula is perfect for the whole family, with zero harsh chemicals and a deliciously sweet mint flavour.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/CUTE/cutetablets.png",
      "/Images/Products/CUTE/cutetablets1.png",
      "/Images/Products/CUTE/cutetablets2.png",
      "/Images/Products/CUTE/cutetablets3.png",
      "/Images/Products/CUTE/cutetablets4.png",
    ],
    accordion: {
      details:
        "Cute is our alcohol-free oral care formula designed for the whole family. Gentle on sensitive gums, tough on bad breath.",
      ingredients:
        "AQUA (WATER), XYLITOL, ALOE BARBADENSIS LEAF JUICE, GLYCERIN, SPEARMINT OIL, SODIUM BENZOATE, CITRIC ACID, STEVIA REBAUDIANA LEAF EXTRACT.",
      "how-to-use": [
        "Measure 10ml and swish for 30 seconds",
        "Spit and do not rinse with water",
        "Use after brushing morning and night",
        "Safe for children aged 6 and above",
      ],
    },
    sectionImage: "/Images/Products/CUTE/cutetablets.png",
    sectionTitle: ["Gentle on everyone", "in the family"],
    sectionBody:
      "Our alcohol-free formula was developed with families in mind. No harsh chemicals, no burning sensation - just fresh, clean breath that lasts all day. Perfect for kids and adults with sensitive gums.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Made For", "every smile"],
    postcardBody:
      "When we created Cute, we wanted a product that brought families together. Our formula has become a staple in households across the world, making oral care simple and enjoyable for everyone.",
    postcardQuote:
      '"It transformed our morning routine - even the kids ask to use it." — Happy Mom, Chicago',
    notes: [
      {
        label: "natural mint",
        description: "refreshing · cooling · invigorating",
        image: "/Images/Products/CUTE/cutetablets.png",
      },
      {
        label: "xylitol",
        description: "tooth-friendly · natural sweetener",
        image: "/Images/Products/CUTE/cutetablets.png",
      },
      {
        label: "aloe vera",
        description: "soothing · gentle · healing",
        image: "/Images/Products/CUTE/cutetablets.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Jennifer K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/22/24",
        title: "KIDS LOVE IT!",
        body: "Finally a formula my kids actually want to use! The cute packaging and mild mint flavour make their morning routine so much easier.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Maria S.",
        initials: "MS",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/18/24",
        title: "GENTLE ON SENSITIVE GUMS",
        body: "I've always struggled with sensitive gums, but this alcohol-free formula is amazing. No burning sensation, just fresh breath.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 4,
        date: "03/30/24",
        title: "GOOD VALUE",
        body: "Great value for money and the natural ingredients make me feel good about what I'm giving my family.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/14/24",
        title: "ECO-FRIENDLY PACKAGING",
        body: "Love that it's good for the planet too. The product works great!",
        helpful: 3,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 5,
        date: "01/25/24",
        title: "FRESH BREATH ALL DAY",
        body: "I use this twice a day and my breath stays fresh literally all day. Highly recommend!",
        helpful: 2,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  "pops-green-apple": {
    id: 5,
    name: "Green Apple",
    category: "POPS",
    price: 29.0,
    rating: 4.7,
    reviewCount: 347,
    description:
      "Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home. These advanced strips use a safe, enamel-friendly formula that effectively removes stains from coffee, wine, and tobacco, revealing a brighter, whiter smile in just 2 weeks.",
    variants: ["Default"],
    variantLabel: "Flavour",
    images: [
      "/Images/Products/Dollipops/Dollipop.png",
      "/Images/Products/Dollipops/Dollipop1.png",
      "/Images/Products/Dollipops/Dollipop2.png",
      "/Images/Products/Dollipops/Dollipop3.png",
      "/Images/Products/Dollipops/Dollipop4.png",
    ],
    accordion: {
      details:
        "This delightful fragrance brings together vibrant fruity notes of raspberry and pear, blended with creamy vanilla and a hint of caramel.",
      ingredients:
        "ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), BENZYL SALICYLATE, LIMONENE, COUMARIN, LINALOOL, BENZYL BENZOATE, CITRAL, GERANIOL.",
      "how-to-use": [
        "Spray on pulse points: wrists, neck, and behind the ears",
        "Apply to freshly moisturized skin for longer lasting scent",
        "Keep away from direct sunlight and heat",
        "Store in a cool, dry place",
      ],
    },
    sectionImage: "/Images/Products/Dollipops/Dollipopsection2.png",
    sectionTitle: ["A Decade", "in the making"],
    sectionBody:
      "Our Mediterranean-inspired signature scent has inspired requests for a perfume since the beginning. After years of development and countless iterations, our iconic fragrance is now available in an eau de parfum.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Postcards From", "puglia"],
    postcardBody:
      "When the time came to bring Dollipops to life, Puglia, Italy was chosen as the perfect backdrop. With its wildflower cliffs and sparkling turquoise seas, it's a true manifestation of the wild Mediterranean vistas that inspired the fragrance.",
    postcardQuote:
      '"It kind of transported me back home—just feeling fresh and being in summer," said campaign star Adria Arjona.',
    notes: [
      {
        label: "top",
        description: "sweet violet · blooming jasmine · soft citrus",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "mid",
        description: "black pepper · velvet woods · clove vanilla",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "base",
        description: "silky sandalwood · shimmery musk · spicy amber",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dorothy M.",
        initials: "DM",
        avatarColor: "#d4b896",
        rating: 5,
        date: "06/11/24",
        title: "LOVE IT",
        body: "These whitening strips are amazing! I noticed a difference after just a few uses. My teeth are noticeably whiter and the application process is so easy.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Sally T.",
        initials: "ST",
        avatarColor: "#b8c9a3",
        rating: 4,
        date: "06/01/24",
        title: "HAPPY",
        body: "Ordered these whitening strips for my daughter, she loves them! We were both impressed with the results after 2 weeks of use.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Laura W.",
        initials: "LW",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/29/24",
        title: "LOVE THE RESULTS",
        body: "I've tried many whitening products and these are by far the best. They work gently without causing any sensitivity.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Ashleigh C.",
        initials: "AC",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "03/23/24",
        title: "THE BEST",
        body: "My favorite whitening product of all time 💕 absolutely love the results I always get compliments on how white my smile is.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Dominique L.",
        initials: "DL",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "03/13/24",
        title: "GREAT PRODUCT",
        body: "I love that these strips are easy to use and actually deliver on their promises. My teeth are noticeably whiter.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  "pops-mixed-berry": {
    id: 6,
    name: "Mixed Berry",
    category: "POPS",
    price: 29.0,
    rating: 4.7,
    reviewCount: 347,
    description:
      "Our professional-grade teeth whitening strips deliver professional-level results from the comfort of home. These advanced strips use a safe, enamel-friendly formula that effectively removes stains from coffee, wine, and tobacco, revealing a brighter, whiter smile in just 2 weeks.",
    variants: ["Default"],
    variantLabel: "Flavour",
    images: [
      "/Images/Products/Dollipops/Mixedberry.png",
      "/Images/Products/Dollipops/Mixedberry1.png",
      "/Images/Products/Dollipops/Mixedberry2.png",
      "/Images/Products/Dollipops/Mixedberry3.png",
      "/Images/Products/Dollipops/Mixedberry4.png",
    ],
    accordion: {
      details:
        "This delightful fragrance brings together vibrant fruity notes of raspberry and pear, blended with creamy vanilla and a hint of caramel.",
      ingredients:
        "ALCOHOL DENAT., PARFUM (FRAGRANCE), AQUA (WATER), BENZYL SALICYLATE, LIMONENE, COUMARIN, LINALOOL, BENZYL BENZOATE, CITRAL, GERANIOL.",
      "how-to-use": [
        "Spray on pulse points: wrists, neck, and behind the ears",
        "Apply to freshly moisturized skin for longer lasting scent",
        "Keep away from direct sunlight and heat",
        "Store in a cool, dry place",
      ],
    },
    sectionImage: "/Images/Products/Dollipops/Dollipopsection2.png",
    sectionTitle: ["A Decade", "in the making"],
    sectionBody:
      "Our Mediterranean-inspired signature scent has inspired requests for a perfume since the beginning. After years of development and countless iterations, our iconic fragrance is now available in an eau de parfum.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Postcards From", "puglia"],
    postcardBody:
      "When the time came to bring Dollipops to life, Puglia, Italy was chosen as the perfect backdrop. With its wildflower cliffs and sparkling turquoise seas, it's a true manifestation of the wild Mediterranean vistas that inspired the fragrance.",
    postcardQuote:
      '"It kind of transported me back home—just feeling fresh and being in summer," said campaign star Adria Arjona.',
    notes: [
      {
        label: "top",
        description: "sweet violet · blooming jasmine · soft citrus",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "mid",
        description: "black pepper · velvet woods · clove vanilla",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "base",
        description: "silky sandalwood · shimmery musk · spicy amber",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dorothy M.",
        initials: "DM",
        avatarColor: "#d4b896",
        rating: 5,
        date: "06/11/24",
        title: "LOVE IT",
        body: "These whitening strips are amazing! I noticed a difference after just a few uses. My teeth are noticeably whiter and the application process is so easy.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Sally T.",
        initials: "ST",
        avatarColor: "#b8c9a3",
        rating: 4,
        date: "06/01/24",
        title: "HAPPY",
        body: "Ordered these whitening strips for my daughter, she loves them! We were both impressed with the results after 2 weeks of use.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Laura W.",
        initials: "LW",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/29/24",
        title: "LOVE THE RESULTS",
        body: "I've tried many whitening products and these are by far the best. They work gently without causing any sensitivity.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Ashleigh C.",
        initials: "AC",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "03/23/24",
        title: "THE BEST",
        body: "My favorite whitening product of all time 💕 absolutely love the results I always get compliments on how white my smile is.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Dominique L.",
        initials: "DL",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "03/13/24",
        title: "GREAT PRODUCT",
        body: "I love that these strips are easy to use and actually deliver on their promises. My teeth are noticeably whiter.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
  smarts: {
    id: 4,
    name: "Denta Smarts",
    category: "SMARTS",
    price: 55.0,
    rating: 4.9,
    reviewCount: 312,
    description:
      "Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.",
    variants: ["Original", "Sensitive"],
    variantLabel: "Formula",
    images: ["/Images/Products/Smarts/Prime.png"],
    accordion: {
      details:
        "Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.",
      ingredients:
        "AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.",
      "how-to-use": [
        "Apply a small amount to a clean toothbrush",
        "Brush gently for 2 minutes",
        "Spit and leave residue for 5 minutes before rinsing",
        "Use twice daily morning and night",
      ],
    },
    sectionImage: "/Images/Products/Smarts/Prime.png",
    sectionTitle: ["Science you can", "trust for your smile"],
    sectionBody:
      "Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.",
    postcardImage: "/Images/Products/Smarts/Prime.png",
    postcardTitle: ["Stories From", "our users"],
    postcardBody:
      "Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.",
    postcardQuote:
      '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      {
        label: "nano-hydroxyapatite",
        description: "mineral restoration · enamel rebuilding",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "fluoride-free",
        description: "safe · natural · effective",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "xylitol enriched",
        description: "cavity prevention · pH balancing",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dr. James K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "DENTIST APPROVED!",
        body: "As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.",
        helpful: 24,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Lisa M.",
        initials: "LM",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "SENSITIVITY GONE!",
        body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!",
        helpful: 18,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/20/24",
        title: "MY DENTIST WAS IMPRESSED",
        body: "During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.",
        helpful: 12,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/10/24",
        title: "CLINICALLY PROVEN",
        body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.",
        helpful: 9,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "01/05/24",
        title: "EFFECTIVE, BUT PRICY",
        body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.",
        helpful: 5,
        notHelpful: 1,
        verified: true,
      },
    ],
  },
  "smarts-prime": {
    id: 9,
    name: "Prime Smarts",
    category: "SMARTS",
    price: 55.0,
    rating: 4.9,
    reviewCount: 312,
    description:
      "Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/Smarts/prime.png",
      "/Images/Products/Smarts/prime1.png",
      "/Images/Products/Smarts/prime2.png",
      "/Images/Products/Smarts/prime3.png",
      "/Images/Products/Smarts/prime4.png",
    ],
    accordion: {
      details:
        "Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.",
      ingredients:
        "AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.",
      "how-to-use": [
        "Apply a small amount to a clean toothbrush",
        "Brush gently for 2 minutes",
        "Spit and leave residue for 5 minutes before rinsing",
        "Use twice daily morning and night",
      ],
    },
    sectionImage: "/Images/Products/Smarts/Prime.png",
    sectionTitle: ["Science you can", "trust for your smile"],
    sectionBody:
      "Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Stories From", "our users"],
    postcardBody:
      "Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.",
    postcardQuote:
      '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      {
        label: "nano-hydroxyapatite",
        description: "mineral restoration · enamel rebuilding",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "fluoride-free",
        description: "safe · natural · effective",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "xylitol enriched",
        description: "cavity prevention · pH balancing",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dr. James K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "DENTIST APPROVED!",
        body: "As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.",
        helpful: 24,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Lisa M.",
        initials: "LM",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "SENSITIVITY GONE!",
        body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!",
        helpful: 18,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/20/24",
        title: "MY DENTIST WAS IMPRESSED",
        body: "During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.",
        helpful: 12,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/10/24",
        title: "CLINICALLY PROVEN",
        body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.",
        helpful: 9,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "01/05/24",
        title: "EFFECTIVE, BUT PRICY",
        body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.",
        helpful: 5,
        notHelpful: 1,
        verified: true,
      },
    ],
  },
  "smarts-junior": {
    id: 10,
    name: "Junior Smarts",
    category: "SMARTS",
    price: 55.0,
    rating: 4.9,
    reviewCount: 312,
    description:
      "Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/Smarts/junior.png",
      "/Images/Products/Smarts/junior1.png",
      "/Images/Products/Smarts/junior2.png",
      "/Images/Products/Smarts/junior3.png",
      "/Images/Products/Smarts/junior4.png",
    ],
    accordion: {
      details:
        "Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.",
      ingredients:
        "AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.",
      "how-to-use": [
        "Apply a small amount to a clean toothbrush",
        "Brush gently for 2 minutes",
        "Spit and leave residue for 5 minutes before rinsing",
        "Use twice daily morning and night",
      ],
    },
    sectionImage: "/Images/Products/Smarts/Prime.png",
    sectionTitle: ["Science you can", "trust for your smile"],
    sectionBody:
      "Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Stories From", "our users"],
    postcardBody:
      "Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.",
    postcardQuote:
      '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      {
        label: "nano-hydroxyapatite",
        description: "mineral restoration · enamel rebuilding",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "fluoride-free",
        description: "safe · natural · effective",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "xylitol enriched",
        description: "cavity prevention · pH balancing",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dr. James K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "DENTIST APPROVED!",
        body: "As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.",
        helpful: 24,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Lisa M.",
        initials: "LM",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "SENSITIVITY GONE!",
        body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!",
        helpful: 18,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/20/24",
        title: "MY DENTIST WAS IMPRESSED",
        body: "During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.",
        helpful: 12,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/10/24",
        title: "CLINICALLY PROVEN",
        body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.",
        helpful: 9,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "01/05/24",
        title: "EFFECTIVE, BUT PRICY",
        body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.",
        helpful: 5,
        notHelpful: 1,
        verified: true,
      },
    ],
  },
  "smarts-dia": {
    id: 11,
    name: "Dia Smarts",
    category: "SMARTS",
    price: 55.0,
    rating: 4.9,
    reviewCount: 312,
    description:
      "Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/Smarts/dia.png",
      "/Images/Products/Smarts/dia1.png",
      "/Images/Products/Smarts/dia2.png",
      "/Images/Products/Smarts/dia3.png",
      "/Images/Products/Smarts/dia4.png",
    ],
    accordion: {
      details:
        "Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.",
      ingredients:
        "AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.",
      "how-to-use": [
        "Apply a small amount to a clean toothbrush",
        "Brush gently for 2 minutes",
        "Spit and leave residue for 5 minutes before rinsing",
        "Use twice daily morning and night",
      ],
    },
    sectionImage: "/Images/Products/Smarts/Prime.png",
    sectionTitle: ["Science you can", "trust for your smile"],
    sectionBody:
      "Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Stories From", "our users"],
    postcardBody:
      "Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.",
    postcardQuote:
      '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      {
        label: "nano-hydroxyapatite",
        description: "mineral restoration · enamel rebuilding",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "fluoride-free",
        description: "safe · natural · effective",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "xylitol enriched",
        description: "cavity prevention · pH balancing",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dr. James K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "DENTIST APPROVED!",
        body: "As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.",
        helpful: 24,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Lisa M.",
        initials: "LM",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "SENSITIVITY GONE!",
        body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!",
        helpful: 18,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/20/24",
        title: "MY DENTIST WAS IMPRESSED",
        body: "During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.",
        helpful: 12,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/10/24",
        title: "CLINICALLY PROVEN",
        body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.",
        helpful: 9,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "01/05/24",
        title: "EFFECTIVE, BUT PRICY",
        body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.",
        helpful: 5,
        notHelpful: 1,
        verified: true,
      },
    ],
  },
  "smarts-pink": {
    id: 12,
    name: "Pink Smarts",
    category: "SMARTS",
    price: 55.0,
    rating: 4.9,
    reviewCount: 312,
    description:
      "Introducing Denta Smarts - our intelligent enamel protection serum that uses advanced nanotechnology to repair and strengthen weakened tooth enamel. Formulated with dentists and backed by clinical studies, this powerful daily treatment reverses early signs of decay, reduces sensitivity, and creates a protective barrier that lasts up to 12 hours.",
    variants: ["Default"],
    variantLabel: "Type",
    images: [
      "/Images/Products/Smarts/pink.png",
      "/Images/Products/Smarts/pink1.png",
      "/Images/Products/Smarts/pink2.png",
      "/Images/Products/Smarts/pink3.png",
      "/Images/Products/Smarts/pink4.png",
    ],
    accordion: {
      details:
        "Denta Smarts uses nano-hydroxyapatite technology to actively remineralise and repair tooth enamel at the microscopic level.",
      ingredients:
        "AQUA (WATER), NANO-HYDROXYAPATITE, XYLITOL, GLYCERIN, SODIUM FLUORIDE, POTASSIUM NITRATE, CARRAGEENAN, SODIUM BENZOATE, SPEARMINT OIL.",
      "how-to-use": [
        "Apply a small amount to a clean toothbrush",
        "Brush gently for 2 minutes",
        "Spit and leave residue for 5 minutes before rinsing",
        "Use twice daily morning and night",
      ],
    },
    sectionImage: "/Images/Products/Smarts/Prime.png",
    sectionTitle: ["Science you can", "trust for your smile"],
    sectionBody:
      "Developed over 8 years with leading dental researchers, Denta Smarts represents the cutting edge of at-home dental care. Our proprietary nanotechnology actively repairs damaged enamel, blocks sensitivity, and prevents future decay.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Stories From", "our users"],
    postcardBody:
      "Thousands of dentists and patients across the world have made Denta Smarts part of their daily routine. Real people, real results — backed by 5 clinical studies with over 2,000 participants.",
    postcardQuote:
      '"My dentist couldn\'t believe the improvement in my enamel health in just 6 months." — Sarah M., Verified User',
    notes: [
      {
        label: "nano-hydroxyapatite",
        description: "mineral restoration · enamel rebuilding",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "fluoride-free",
        description: "safe · natural · effective",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "xylitol enriched",
        description: "cavity prevention · pH balancing",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Dr. James K.",
        initials: "JK",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "DENTIST APPROVED!",
        body: "As a practicing dentist, I can confidently say this product is revolutionary. My patients show measurable improvement in enamel strength after just 3 months.",
        helpful: 24,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Lisa M.",
        initials: "LM",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "SENSITIVITY GONE!",
        body: "I've suffered from severe tooth sensitivity for years. After using Denta Smarts for 6 weeks, my sensitivity is completely gone. Life changing!",
        helpful: 18,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Robert T.",
        initials: "RT",
        avatarColor: "#c9b0b0",
        rating: 5,
        date: "03/20/24",
        title: "MY DENTIST WAS IMPRESSED",
        body: "During my last checkup, my dentist asked what I was doing differently - early cavity signs had reversed.",
        helpful: 12,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Sarah L.",
        initials: "SL",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/10/24",
        title: "CLINICALLY PROVEN",
        body: "After 6 months of use, I'm a believer. My enamel feels stronger than ever.",
        helpful: 9,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "Amanda P.",
        initials: "AP",
        avatarColor: "#d4c4a8",
        rating: 4,
        date: "01/05/24",
        title: "EFFECTIVE, BUT PRICY",
        body: "This product definitely works - my dentist noticed the difference immediately. It pays for itself in reduced dental bills.",
        helpful: 5,
        notHelpful: 1,
        verified: true,
      },
    ],
  },
  "bits-dentabits": {
    id: 13,
    name: "Dentabits",
    category: "BITS",
    price: 45.0,
    rating: 4.8,
    reviewCount: 256,
    description:
      "Introducing Dentabits - our revolutionary whitening bits that transform your oral care routine. These eco-friendly, dissolvable bits pack a powerful punch of natural enamel-safe ingredients that remove surface stains while freshening breath. Perfect for travel and daily use.",
    variants: ["Default"],
    variantLabel: "Pack",
    images: [
      "/Images/Products/Bits/Dentabits.png",
      "/Images/Products/Bits/Dentabits1.png",
      "/Images/Products/Bits/Dentabits2.png",
      "/Images/Products/Bits/Dentabits3.png",
      "/Images/Products/Bits/Dentabits4.png",
    ],
    accordion: {
      details:
        "Dentabits are compact, dissolvable oral care tablets packed with enamel-safe whitening minerals and breath-freshening actives.",
      ingredients:
        "XYLITOL, SODIUM BICARBONATE, CALCIUM CARBONATE, MAGNESIUM STEARATE, SPEARMINT OIL, PEPPERMINT OIL, STEVIA LEAF EXTRACT.",
      "how-to-use": [
        "Pop one bit in your mouth and let it dissolve",
        "Brush teeth as normal for 2 minutes",
        "Rinse thoroughly",
        "Use twice daily for best results",
      ],
    },
    sectionImage: "/Images/Products/Bits/Dentabits.png",
    sectionTitle: ["Years of Research", "in every bit"],
    sectionBody:
      "After years of research and development, we created Dentabits to revolutionize oral care. Our dissolvable whitening bits combine natural ingredients with advanced technology to deliver professional-level results from the comfort of your home.",
    postcardImage: "/Images/Products/Dollipops/Dollipopsection3.png",
    postcardTitle: ["Inspired By", "nature"],
    postcardBody:
      "Dentabits was born from a desire to make oral care sustainable and effective. Every ingredient is sourced responsibly, and our zero-plastic packaging means you can care for your smile while caring for the planet.",
    postcardQuote:
      '"Dentabits represents the future of oral care - effective, convenient, and environmentally responsible." — Dr. Amanda Chen',
    notes: [
      {
        label: "natural",
        description: "fluoride free · eco-friendly · cruelty free",
        image: "/Images/Products/Dollipops/DIng1.png",
      },
      {
        label: "whitening",
        description: "polishing minerals · enamel safe · stain removal",
        image: "/Images/Products/Dollipops/DIng2.png",
      },
      {
        label: "fresh",
        description: "long lasting · minty cool · alcohol free",
        image: "/Images/Products/Dollipops/DIng3.png",
      },
    ],
    reviewList: [
      {
        id: 1,
        name: "Sarah J.",
        initials: "SJ",
        avatarColor: "#d4b896",
        rating: 5,
        date: "05/15/24",
        title: "AMAZING RESULTS",
        body: "I've been using Dentabits for two weeks and my teeth are noticeably whiter. The bits are so convenient for travel.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 2,
        name: "Mike T.",
        initials: "MT",
        avatarColor: "#b8c9a3",
        rating: 5,
        date: "04/28/24",
        title: "CONVENIENT & EFFECTIVE",
        body: "As someone who travels frequently, these bits are a game-changer. No more bulky toothpaste tubes.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 3,
        name: "Emma W.",
        initials: "EW",
        avatarColor: "#c9b0b0",
        rating: 4,
        date: "03/20/24",
        title: "LOVE THE ECO-FRIENDLY ASPECT",
        body: "Finally, a toothpaste alternative that's good for the planet! The dissolvable bits eliminate plastic waste.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 4,
        name: "Lisa C.",
        initials: "LC",
        avatarColor: "#a8bfd4",
        rating: 5,
        date: "02/15/24",
        title: "MY NEW FAVORITE",
        body: "Dentabits has completely converted me. My dentist even commented on how much cleaner my teeth look!",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
      {
        id: 5,
        name: "David L.",
        initials: "DL",
        avatarColor: "#d4c4a8",
        rating: 5,
        date: "01/30/24",
        title: "WORTH EVERY PENNY",
        body: "The whitening effects are real. After a month of use, coffee and wine stains have significantly reduced.",
        helpful: 0,
        notHelpful: 0,
        verified: true,
      },
    ],
  },
};

const FAQ_ITEMS = [
  {
    key: "dental-nutrition",
    question: "What does Dental Nutrition mean?",
    answer:
      "Dental Nutrition means oral care in an edible form. It is the science of using nutrients to support teeth, gums, and oral microbiome health. Our products are designed to nourish and protect the mouth, beyond just brushing and flossing.",
  },
  {
    key: "teeth-nutrition",
    question: "Why do teeth need nutrition?",
    answer:
      "Teeth and gums are living tissues that need nutrients to stay strong, resist decay, and recover from everyday damage. Targeted nutrition helps maintain enamel strength, gum health, and overall oral balance.",
  },
  {
    key: "vs-brushing",
    question: "How does Dental nutrition differ from brushing?",
    answer:
      "Brushing works for only 1-2 minutes, leaving the mouth unprotected for the rest of the day. Dental Nutrition helps maintain a stable, healthy oral environment for the remaining 23 hours and 58 minutes.",
  },
  {
    key: "hetafu-better",
    question: "Why are Hetafu products better than other oral care products?",
    answer:
      "Hetafu is the world's first Dental Nutrition approach, offering edible oral care that nourishes teeth, gums, and the oral microbiome. Unlike regular oral care products that kill both good and bad bacteria, Hetafu selectively reduces harmful microbes within 1 minute while supporting beneficial ones.",
  },
  {
    key: "replace-brushing",
    question: "Does Dental Nutrition replace brushing and flossing?",
    answer:
      "No, it doesn't replace them. Dental Nutrition works alongside brushing and flossing to provide all-day protection, microbiome balance, and targeted oral support that regular cleaning cannot offer.",
  },
];

const REVIEWS_PER_PAGE = 5;

/** Fill marketing-section fields when product comes from the API without static page data. */
function ensureProductDisplayFields(product) {
  if (!product) return product;

  const apiImages = product.images?.length
    ? product.images
    : [product.image_url, product.sectionImage, product.postcardImage].filter(
        Boolean,
      );
  const fallbackImages = product.fallbackImages?.length
    ? product.fallbackImages
    : apiImages.filter(
        (url) => typeof url === "string" && url.startsWith("/Images/"),
      );
  const defaultFallback =
    fallbackImages[0] || "/Images/Products/Dollipops/Dollipop.png";
  const resolvedImages = resolveProductImages(
    apiImages,
    fallbackImages.length ? fallbackImages : [defaultFallback],
  );

  const makeNote = (index, label) => ({
    label,
    description:
      product.description?.slice(0, 80) || "quality · care · freshness",
    image:
      resolvedImages[index % Math.max(resolvedImages.length, 1)] ||
      defaultFallback,
  });

  const notes =
    product.notes?.length >= 3
      ? product.notes
      : [makeNote(0, "natural"), makeNote(1, "fresh"), makeNote(2, "care")];

  return {
    ...product,
    images: resolvedImages.length ? resolvedImages : [defaultFallback],
    fallbackImages: fallbackImages.length ? fallbackImages : resolvedImages,
    variants: product.variants?.length ? product.variants : [product.name],
    variantLabel: product.variantLabel || "Variant",
    notes,
    sectionImage: product.sectionImage || defaultFallback,
    sectionTitle:
      product.sectionTitle?.length >= 2
        ? product.sectionTitle
        : [product.name || "Our", "Product"],
    sectionBody: product.sectionBody || product.description || "",
    postcardImage: product.postcardImage || defaultFallback,
    postcardTitle:
      product.postcardTitle?.length >= 2
        ? product.postcardTitle
        : ["Discover", product.name || ""],
    postcardBody: product.postcardBody || product.description || "",
    postcardQuote: product.postcardQuote || "",
    reviewList: product.reviewList || [],
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    accordion: product.accordion || {
      details: product.description || "",
      ingredients: "",
      "how-to-use": [],
    },
  };
}

function StarRow({ rating, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rating ? "#1998B1" : "#e8ddd0"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function DecadeSection({ product }) {
  if (!product.notes?.[0]?.image) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-10 py-6 md:py-20 bg-[#fdf8f4] font-sans text-primary-brown">
      {/* Original desktop layout preserved, only mobile responsiveness added */}
      <div
        className="hidden xl:grid grid-cols-2"
        style={{ gridTemplateRows: "auto auto" }}
      >
        <div className="relative">
          <img
            src={product.sectionImage}
            alt={product.name}
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center pl-30">
          <h2
            className="text-5xl font-light mb-2"
            style={{
              fontFamily: '"Futura BT Book", sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            {product.sectionTitle[0]}
          </h2>
          <p className="text-5xl italic font-light mb-2 font-signature text-secondary-blue tracking-tight">
            {product.sectionTitle[1]}
          </p>
          <div className="w-12 h-0.5 bg-[#d4c5b2] mb-8"></div>
          <p
            className="text-sm leading-relaxed text-[#554433] mb-8 max-w-md"
            style={{ lineHeight: "1.7" }}
          >
            {product.sectionBody}
          </p>
          <p
            className="text-xs font-semibold tracking-widest uppercase text-[#401E17] mb-4"
            style={{ letterSpacing: "0.12em" }}
          >
            Be Transported
          </p>
        </div>
        <div className="relative pt-4" style={{ height: "640px" }}>
          <div
            className="absolute flex items-start gap-6"
            style={{ top: 0, left: 0, transform: "rotate(-7deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "280px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng1.png"
                alt={product.notes[0].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-8">
              <p className="text-center mb-2 font-signature text-[2.7rem] text-secondary-blue">
                {product.notes[0].label}
              </p>
              {product.notes[0].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "13px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div
            className="absolute flex items-start gap-6"
            style={{ top: "220px", left: "420px", transform: "rotate(-8deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "280px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng3.png"
                alt={product.notes[2].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2 font-signature text-[2.7rem] text-secondary-blue">
                {product.notes[2].label}
              </p>
              {product.notes[2].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "13px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div
            className="absolute flex items-start gap-6"
            style={{ top: "430px", left: 0, transform: "rotate(3deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "280px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng2.png"
                alt={product.notes[1].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2 font-signature text-[2.7rem] text-secondary-blue">
                {product.notes[1].label}
              </p>
              {product.notes[1].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "13px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start relative justify-end" style={{ height: "420px" }}>
          <div
            className="hidden xl:block bg-white shadow-md absolute hover:shadow-lg transition-all"
            style={{
              width: "clamp(420px, 34vw, 560px)",
              left: "180px",
              transform: "rotate(8deg)",
              padding: "16px",
            }}
          >
            <img
              src={product.postcardImage}
              alt={product.name}
              className="w-full h-auto object-cover rounded-sm"
            />
            <p className="text-center mt-4 pr-1 font-signature text-[2.4rem] leading-tight">
              key benefits
            </p>
          </div>
        </div>
      </div>
      {/* Tablet and mobile layout */}
      <div className="xl:hidden grid grid-cols-1 gap-8">
        <div className="relative">
          <img
            src={product.sectionImage}
            alt={product.name}
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-4">
          <h2
            className="text-3xl font-light mb-2"
            style={{
              fontFamily: '"Futura BT Book", sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            {product.sectionTitle[0]}
          </h2>
          <p className="text-3xl italic font-light mb-2 font-signature text-secondary-blue tracking-tight">
            {product.sectionTitle[1]}
          </p>
          <div className="w-12 h-0.5 bg-[#d4c5b2] mb-8"></div>
          <p
            className="text-sm leading-relaxed text-[#554433] mb-8 max-w-md"
            style={{ lineHeight: "1.7" }}
          >
            {product.sectionBody}
          </p>
          <p
            className="text-xs font-semibold tracking-widest uppercase text-[#401E17] mb-4"
            style={{ letterSpacing: "0.12em" }}
          >
            Be Transported
          </p>
        </div>
        <div className="relative pt-4" style={{ minHeight: "1100px" }}>
          <div
            className="absolute flex items-start gap-4"
            style={{ top: "20px", left: "10px", transform: "rotate(-7deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "220px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng1.png"
                alt={product.notes[0].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-8">
              <p className="text-center mb-2 font-signature text-[2rem] text-secondary-blue">
                {product.notes[0].label}
              </p>
              {product.notes[0].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "12px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div
            className="absolute flex items-start gap-4"
            style={{ top: "270px", left: "30%", transform: "rotate(-8deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "200px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng3.png"
                alt={product.notes[2].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2 font-signature text-[1.8rem] text-secondary-blue">
                {product.notes[2].label}
              </p>
              {product.notes[2].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "11px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div
            className="absolute flex items-start gap-4"
            style={{ top: "510px", left: "20px", transform: "rotate(3deg)" }}
          >
            <div
              className="bg-white shadow-md flex-shrink-0"
              style={{ width: "200px", padding: "10px" }}
            >
              <img
                src="/Images/Products/Dollipops/DIng2.png"
                alt={product.notes[1].label}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="pt-2">
              <p className="text-center mb-2 font-signature text-[1.8rem] text-secondary-blue">
                {product.notes[1].label}
              </p>
              {product.notes[1].description.split(" · ").map((line, i) => (
                <p
                  key={i}
                  className="text-center leading-relaxed m-0"
                  style={{ fontSize: "11px" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div
            className="absolute"
            style={{ top: "760px", left: "50%", transform: "translateX(-50%) rotate(5deg)", width: "90%", maxWidth: "420px" }}
          >
            <div
              className="bg-white shadow-md hover:shadow-lg transition-all"
              style={{ padding: "14px" }}
            >
              <img
                src={product.postcardImage}
                alt={product.name}
                className="w-full h-auto object-cover rounded-sm"
              />
              <p className="text-center mt-4 pr-1 font-signature text-[1.6rem]">
                key benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardsSection({ product }) {
  if (!product.postcardImage) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-10 py-4 md:py-20 bg-[#fdf8f4] text-[#401E17]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-15 items-center">
        <div
          className="relative w-full order-2 lg:order-none"
          style={{ minHeight: "320px", height: "auto" }}
        >
          <img
            src={product.postcardImage}
            alt={product.postcardTitle[0]}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="flex flex-col px-4 lg:pl-5 order-1 lg:order-none">
          <h2 className="text-3xl md:text-5xl font-light text-[#401E17] leading-tight mb-1 tracking-tight">
            {product.postcardTitle[0]}
          </h2>
          <p className="text-3xl md:text-5xl italic font-light text-secondary-blue mb-1 tracking-tight font-signature">
            {product.postcardTitle[1]}
          </p>
          <div className="w-12 h-0.5 bg-[#1998B1] mb-7"></div>
          <p className="text-sm leading-[1.9] text-[#554433] font-light max-w-sm mb-8">
            {product.postcardBody}
          </p>
          <blockquote className="border-l-[3px] border-[#1998B1] pl-5 max-w-md">
            <p className="text-base leading-[1.8] text-[#401E17] font-light mb-3 italic">
              {product.postcardQuote}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ product, onStatsChange }) {
  const productId = product?.id;
  const usesApiReviews = isMongoObjectId(productId);

  const [reviews, setReviews] = useState(
    usesApiReviews ? [] : [...(product.reviewList || [])],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("verified");
  const [filterRating, setFilterRating] = useState("all");
  const [helpfulMap, setHelpfulMap] = useState({});
  const [averageRating, setAverageRating] = useState(product.rating ?? 0);
  const [reviewCount, setReviewCount] = useState(product.reviewCount ?? 0);
  const [loadingReviews, setLoadingReviews] = useState(usesApiReviews);

  useEffect(() => {
    if (!usesApiReviews) {
      setReviews([...(product.reviewList || [])]);
      setAverageRating(product.rating ?? 0);
      setReviewCount(product.reviewCount ?? product.reviewList?.length ?? 0);
      return undefined;
    }

    let cancelled = false;

    async function loadReviews() {
      setLoadingReviews(true);
      try {
        const data = await fetchProductReviews(productId, {
          page: currentPage,
          limit: REVIEWS_PER_PAGE,
          sortBy,
          rating: filterRating,
        });
        if (cancelled) return;
        setReviews(data.items || []);
        setTotalPages(data.pages || 1);
        setAverageRating(data.average_rating || 0);
        setReviewCount(data.review_count || 0);
      } catch {
        if (!cancelled) {
          setReviews([]);
          setTotalPages(1);
          setAverageRating(0);
          setReviewCount(0);
        }
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [usesApiReviews, productId, currentPage, sortBy, filterRating]);

  useEffect(() => {
    if (!usesApiReviews || !onStatsChange || loadingReviews) return;
    onStatsChange({ averageRating, reviewCount });
  }, [
    usesApiReviews,
    onStatsChange,
    averageRating,
    reviewCount,
    loadingReviews,
  ]);

  const overallRating = usesApiReviews
    ? reviewCount > 0
      ? Number(averageRating).toFixed(1)
      : "0.0"
    : reviews.length
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : (product.rating ?? 0).toFixed(1);
  const displayReviewCount = usesApiReviews
    ? reviewCount
    : (product.reviewCount ?? reviews.length);

  let displayedReviews = reviews;
  let displayedTotalPages = totalPages;
  if (!usesApiReviews) {
    const filtered = reviews.filter((r) =>
      filterRating === "all" ? true : r.rating === parseInt(filterRating, 10),
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });
    displayedTotalPages = Math.max(
      1,
      Math.ceil(sorted.length / REVIEWS_PER_PAGE),
    );
    displayedReviews = sorted.slice(
      (currentPage - 1) * REVIEWS_PER_PAGE,
      currentPage * REVIEWS_PER_PAGE,
    );
  }

  const handleHelpful = (id, type) =>
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  const handlePageChange = (page) => {
    setCurrentPage(page);
    document
      .getElementById("reviews-section-anchor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showPagination = !loadingReviews;

  return (
    <section
      id="reviews-section-anchor"
      className="max-w-[1400px] mx-auto"
      style={{ position: "relative", paddingTop: product.category === 'POPS' ? "100px" : "40px" }}
    >
      {product.category === 'POPS' && (
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            marginTop: "-30px",
          }}
        >
          <div className="hidden md:flex absolute top-[-50px] left-1/2 -translate-x-1/2 z-[1]">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/footer_plants.png"
              alt="decorative plants"
              className="h-[150px] w-auto block"
            />
          </div>
          <div className="flex md:hidden absolute top-[-20px] left-1/2 -translate-x-1/2 z-[1] w-full">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/footer_plants.png"
              alt="decorative plants"
              className="w-full h-auto block"
            />
          </div>
          <svg
            className="w-full"
            viewBox="0 0 1400 80"
            preserveAspectRatio="none"
            style={{
              display: "block",
              position: "relative",
              zIndex: 2,
              height: "100px",
            }}
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#fdf8f4", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "var(--color-background)", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <path
              d="M0,40 Q350,15 700,40 T1400,40 L1400,80 L0,80 Z"
              fill="url(#waveGradient)"
              stroke="none"
            />
          </svg>
          <div className="hidden md:flex absolute top-[-70px] left-1/2 -translate-x-1/2 z-[1.5] flex-col items-center">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/tiger_head.png"
              alt="tiger head"
              className="w-[280px] h-auto mb-[-30px]"
            />
          </div>
          <div className="hidden md:flex absolute top-[26px] left-1/2 -translate-x-1/2 z-10 gap-[90px]">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/left_leg.png"
              alt="tiger left paw"
              className="w-[75px] h-auto"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/right_leg.png"
              alt="tiger right paw"
              className="w-[75px] h-auto"
            />
          </div>
          {/* Mobile tiger */}
          <div className="flex md:hidden absolute top-[-35px] left-1/2 -translate-x-1/2 z-[1.5] flex-col items-center">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/tiger_head.png"
              alt="tiger head"
              className="w-[180px] h-auto mb-[-20px]"
            />
          </div>
          <div className="flex md:hidden absolute top-[18px] left-1/2 -translate-x-1/2 z-10 gap-[60px]">
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/left_leg.png"
              alt="tiger left paw"
              className="w-[50px] h-auto"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/0178/3798/1796/files/right_leg.png"
              alt="tiger right paw"
              className="w-[50px] h-auto"
            />
          </div>
        </div>
      )}
      <div className="px-4 md:px-10 py-12 md:py-20">
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .review-card-anim { animation: fadeSlideUp 0.35s ease both; }
          .review-card-anim:nth-child(1) { animation-delay: 0.0s; }
          .review-card-anim:nth-child(2) { animation-delay: 0.05s; }
          .review-card-anim:nth-child(3) { animation-delay: 0.10s; }
          .review-card-anim:nth-child(4) { animation-delay: 0.15s; }
          .review-card-anim:nth-child(5) { animation-delay: 0.20s; }
        `}</style>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-3xl md:text-4xl lg:text-5xl font-light text-[#401E17] leading-tight">
              {overallRating}
            </span>
            <div>
              <StarRow
                rating={Math.round(parseFloat(overallRating))}
                size={18}
              />
              <p className="text-xs text-[#887766] tracking-widest uppercase mt-1">
                Based on {displayReviewCount} reviews
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-[#e8ddd0]">
          <select
            className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer"
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value);
              setCurrentPage(1);
            }}
            disabled={!usesApiReviews && reviews.length === 0}
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s} Stars
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-[#887766] tracking-widest uppercase">
              Sort by:
            </span>
            <select
              className="appearance-none bg-white border border-[#d4c5b2] rounded px-3.5 py-2 text-xs tracking-widest uppercase text-[#401E17] cursor-pointer"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="verified">Verified purchase</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>
        {loadingReviews ? (
          <p className="text-center text-sm text-[#887766] py-12">
            Loading reviews...
          </p>
        ) : displayedReviews.length === 0 ? (
          <p className="text-center text-sm text-[#887766] py-12">
            No reviews yet.
          </p>
        ) : (
          <div
            className="mx-auto max-w-6xl"
            key={`${currentPage}-${sortBy}-${filterRating}`}
          >
            {displayedReviews.map((review, idx) => (
              <div key={review.id}>
                <div className="review-card-anim py-7 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#401E17] tracking-wider flex-shrink-0"
                        style={{ backgroundColor: review.avatarColor }}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <p className="m-0 text-sm font-semibold text-[#401E17] tracking-wider">
                          {review.name}
                        </p>
                        <StarRow rating={review.rating} size={11} />
                      </div>
                    </div>
                    <p className="m-0 text-xs text-[#a08862] tracking-wider">
                      {review.date}
                    </p>
                  </div>
                  <div>
                    <h4 className="m-0 mb-2.5 text-sm font-bold text-[#401E17] tracking-wider uppercase">
                      {review.title}
                    </h4>
                    <p className="m-0 mb-5 text-sm leading-[1.8] text-[#554433] font-light">
                      {review.body}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      {review.verified && (
                        <span className="text-xs text-[#a08862] tracking-wider uppercase flex items-center gap-1">
                          <svg
                            width={10}
                            height={10}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a08862"
                            strokeWidth={2.5}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified purchase
                        </span>
                      )}
                      <button
                        className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === "up" ? "bg-[#401E17] text-[#fdf8f4] border-[#401E17]" : "border-[#e8ddd0] text-[#887766] hover:border-[#a08862]"}`}
                        onClick={() => handleHelpful(review.id, "up")}
                      >
                        <ThumbsUp size={10} />
                        {review.helpful +
                          (helpfulMap[review.id] === "up" ? 1 : 0)}
                      </button>
                      <button
                        className={`inline-flex items-center gap-1.5 border rounded px-2.5 py-1 text-xs tracking-wider uppercase transition-all ${helpfulMap[review.id] === "down" ? "bg-[#401E17] text-[#fdf8f4] border-[#401E17]" : "border-[#e8ddd0] text-[#887766] hover:border-[#a08862]"}`}
                        onClick={() => handleHelpful(review.id, "down")}
                      >
                        <ThumbsDown size={10} />
                        {review.notHelpful +
                          (helpfulMap[review.id] === "down" ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </div>
                {idx < displayedReviews.length - 1 && (
                  <hr className="border-none border-t border-[#f0e8df]" />
                )}
              </div>
            ))}
          </div>
        )}
        {showPagination && (
          <div className="flex flex-col items-center gap-3 mt-12 pt-8 border-t border-[#e8ddd0]">
            <p className="text-xs text-[#887766] tracking-widest uppercase">
              Page {currentPage} of {displayedTotalPages}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                className="w-8.5 h-8.5 inline-flex cursor-pointer items-center justify-center text-xs font-medium transition-all hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: displayedTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all ${currentPage === page ? "bg-[#401E17] text-[#fdf8f4]" : "border border-[#d4c5b2] hover:bg-[#401E17] hover:text-[#fdf8f4]"}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                type="button"
                className="w-8.5 h-8.5 cursor-pointer inline-flex items-center justify-center text-xs font-medium transition-all hover:bg-[#401E17] hover:text-[#fdf8f4] disabled:opacity-35 disabled:cursor-default"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === displayedTotalPages}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductPage({ params }) {
  let slug;
  if (params instanceof Promise) {
    const resolvedParams = use(params);
    slug = resolvedParams.slug;
  } else {
    slug = params.slug;
  }

  const categoryKey = slugToCategoryKey(slug);
  if (categoryKey) {
    return <CategoryProductDetailPage categoryKey={categoryKey} />;
  }

  return <ProductDetail slug={slug} />;
}

function ProductDetail({ slug }) {
  const staticProduct = ALL_PRODUCTS[slug];
  const [product, setProduct] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFromApi() {
      try {
        const apiProduct = await fetchProductBySlug(slug);
        if (cancelled) return;

        const staticMarketing = staticProduct || {};

        setProduct(
          ensureProductDisplayFields({
            id: apiProduct.id,
            name: apiProduct.name,
            category: apiProduct.category,
            price: apiProduct.discount_price ?? apiProduct.price ?? 0,
            rating: apiProduct.average_rating ?? 0,
            reviewCount: apiProduct.review_count ?? 0,
            description: apiProduct.description || '',
            variants: [apiProduct.name],
            variantLabel: 'Variant',
            images: resolveProductImages(
              apiProduct.images?.length
                ? apiProduct.images
                : [apiProduct.image_url].filter(Boolean),
              staticMarketing.images || staticMarketing.fallbackImages,
            ),
            fallbackImages: staticMarketing.images || staticMarketing.fallbackImages || [],
            accordion: staticMarketing.accordion || {
              details: apiProduct.description || '',
              ingredients: '',
              'how-to-use': [],
            },
            sectionImage: apiProduct.images?.[0] || apiProduct.image_url || staticMarketing.sectionImage,
            sectionTitle: staticMarketing.sectionTitle,
            sectionBody: staticMarketing.sectionBody || apiProduct.description || '',
            postcardImage: apiProduct.images?.[0] || apiProduct.image_url || staticMarketing.postcardImage,
            postcardTitle: staticMarketing.postcardTitle,
            postcardBody: staticMarketing.postcardBody,
            postcardQuote: staticMarketing.postcardQuote,
            notes: staticMarketing.notes,
            reviewList: [],
          }),
        );
      } catch {
        if (!cancelled && staticProduct) {
          setProduct(staticProduct);
        }
      } finally {
        if (!cancelled) {
          setApiLoaded(true);
        }
      }
    }

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [slug, staticProduct]);

  if (!product && apiLoaded) return notFound();
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-primary-brown">
          Loading product...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ProductDetailView
      product={ensureProductDisplayFields(product)}
      slug={slug}
    />
  );
}

function ProductDetailView({
  product: rawProduct,
  variantCatalog = null,
  defaultVariant = null,
}) {
  const baseProduct = ensureProductDisplayFields(rawProduct);
  const [selectedVariant, setSelectedVariant] = useState(
    defaultVariant || baseProduct.variants[0],
  );
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [thumbStart, setThumbStart] = useState(0);
  const [openAccordion, setOpenAccordion] = useState("dental-nutrition");
  const [isAdding, setIsAdding] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[baseProduct.category] || null;
  const variantDefForPack =
    categoryConfig?.variants?.find((v) => v.label === selectedVariant) ||
    (selectedVariant === "Default"
      ? categoryConfig?.variants?.find((v) => v.label === baseProduct.name)
      : null) ||
    (categoryConfig?.variants?.length === 1
      ? categoryConfig.variants[0]
      : null);

  const activeVariantData = variantCatalog?.[selectedVariant] || null;
  const product = ensureProductDisplayFields(
    activeVariantData
      ? {
          ...baseProduct,
          ...activeVariantData,
          name:
            activeVariantData.apiName ||
            activeVariantData.name ||
            baseProduct.name,
          displayName: baseProduct.displayName || baseProduct.name,
          category: baseProduct.category,
          variants: baseProduct.variants,
          variantLabel: baseProduct.variantLabel,
          packOptions: activeVariantData.packOptions ?? baseProduct.packOptions,
          price: activeVariantData.price ?? baseProduct.price,
          description: activeVariantData.description ?? baseProduct.description,
          rating: activeVariantData.rating ?? baseProduct.rating ?? 0,
          reviewCount: activeVariantData.reviewCount ?? baseProduct.reviewCount ?? 0,
          reviewList: activeVariantData.reviewList ?? [],
          images: activeVariantData.images?.length
            ? activeVariantData.images
            : baseProduct.images,
          fallbackImages:
            activeVariantData.fallbackImages || baseProduct.fallbackImages,
        }
      : baseProduct,
  );

  const packOptionsConfig =
    product.packOptions ||
    activeVariantData?.packOptions ||
    getPackOptionsForVariant(variantDefForPack, categoryConfig);

  const effectivePackId = selectedPackId ?? getDefaultPackId(packOptionsConfig);

  useEffect(() => {
    setSelectedPackId(getDefaultPackId(packOptionsConfig));
  }, [selectedVariant, baseProduct.category]);

  const selectedPackOption = getPackOption(packOptionsConfig, effectivePackId);
  const unitPrice = resolvePackPrice(product.price, selectedPackOption);
  const displayPrice = unitPrice * quantity;
  const showVariantSelector = (product.variants?.length ?? 0) > 1;
  const showPackSelector =
    (packOptionsConfig?.options?.length ?? 0) > 1 ||
    packOptionsConfig?.alwaysShow;
  const packLabel = packOptionsConfig?.label || "Pack size";

  const [mainImage, setMainImage] = useState(product.images[0]);

  useEffect(() => {
    setMainImage(product.images?.[0] || null);
    setThumbStart(0);
  }, [selectedVariant, product.images?.[0]]);

  const imageFallback = (url) => {
    const idx = product.images?.indexOf(url);
    return getImageFallback(product.fallbackImages, idx >= 0 ? idx : 0);
  };

  const VISIBLE = 5;

  const { addItemNoDrawer, setDrawerOpen } = useCart();
  const { currency } = useCountry();

  const reviewProductId = isMongoObjectId(product?.id) ? product.id : null;
  const [liveReviewStats, setLiveReviewStats] = useState(null);
  const [loadingReviewStats, setLoadingReviewStats] = useState(
    Boolean(reviewProductId),
  );

  const handleReviewStatsChange = useCallback(
    ({ averageRating, reviewCount }) => {
      setLiveReviewStats({ averageRating, reviewCount });
      setLoadingReviewStats(false);
    },
    [],
  );

  useEffect(() => {
    setLoadingReviewStats(Boolean(reviewProductId));
    setLiveReviewStats(null);
  }, [reviewProductId]);

  const heroRatingLabel = reviewProductId
    ? loadingReviewStats
      ? null
      : liveReviewStats?.reviewCount > 0
        ? Number(liveReviewStats.averageRating).toFixed(1)
        : "0.0"
    : Number(product.rating ?? 0).toFixed(1);
  const heroReviewCount = reviewProductId
    ? loadingReviewStats
      ? null
      : (liveReviewStats?.reviewCount ?? 0)
    : (product.reviewCount ?? 0);

  const handleAddToBag = () => {
    setIsAdding(true);
    const baseCartId = activeVariantData?.id ?? product.id;
    const packSuffix = selectedPackOption?.id
      ? `-${selectedPackOption.id}`
      : "";
    const cartId = `${baseCartId}${packSuffix}`;
    const variantParts = [
      ...(product.variants.length > 1 ? [selectedVariant] : []),
      selectedPackOption?.label,
    ].filter(Boolean);
    const cartVariant = variantParts.join(" · ");
    addItemNoDrawer({
      id: cartId,
      productId: isMongoObjectId(baseCartId) ? baseCartId : null,
      packId: selectedPackOption?.id || null,
      name: product.name,
      variant: cartVariant,
      price: unitPrice,
      originalPrice: null,
      qty: quantity,
      promo: null,
      image: product.images[0],
    });
    // Show loader for 800ms, then open drawer
    setTimeout(() => {
      setIsAdding(false);
      setDrawerOpen(true);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-3 py-4 md:px-5 md:py-5 lg:px-8 lg:py-8 font-sans bg-background text-primary-brown">
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm uppercase tracking-wider text-primary-brown">
            <Link
              href="/"
              className="no-underline font-bold transition-colors hover:text-amber-700"
            >
              HOME
            </Link>
            <span className="mx-1">&gt;</span>
            <span className="font-bold">{product.name.toUpperCase()}</span>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-16 mt-4 md:mt-6 lg:mt-12"
            style={{ alignItems: "start" }}
          >
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 lg:items-start">
              {/* Desktop: vertical thumbnails */}
              <div
                className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0"
                style={{ width: "98px" }}
              >
                <button
                  onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
                  disabled={thumbStart === 0}
                  className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30"
                >
                  ↑
                </button>
                {product.images
                  .slice(thumbStart, thumbStart + VISIBLE)
                  .map((thumbnail, index) => (
                    <div
                      key={thumbStart + index}
                      onClick={() => setMainImage(thumbnail)}
                      className={`flex-shrink-0 cursor-pointer overflow-hidden border-2 bg-amber-50 transition-all hover:border-amber-600 ${mainImage === thumbnail ? "border-amber-700" : "border-gray-200"}`}
                    >
                      <ProductImage
                        src={thumbnail}
                        fallbackSrc={imageFallback(thumbnail)}
                        alt={`${product.name} ${thumbStart + index + 1}`}
                        width={88}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                <button
                  onClick={() =>
                    setThumbStart((s) =>
                      Math.min(product.images.length - VISIBLE, s + 1),
                    )
                  }
                  disabled={thumbStart + VISIBLE >= product.images.length}
                  className="w-full py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>

              <div className="w-full lg:flex-1 lg:min-w-0 flex flex-col gap-2">
                <div className="w-full bg-amber-50 overflow-hidden">
                  <ProductImage
                    src={mainImage}
                    fallbackSrc={imageFallback(mainImage)}
                    alt={product.name}
                    width={423}
                    height={580}
                    priority
                    className="w-full h-auto block object-contain"
                  />
                </div>

                {/* Mobile & tablet: horizontal thumbnails below main image */}
                {product.images.length > 1 && (
                  <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory">
                    {product.images.map((thumbnail, index) => (
                      <button
                        key={`${thumbnail}-${index}`}
                        type="button"
                        onClick={() => setMainImage(thumbnail)}
                        className={`shrink-0 snap-start w-16 h-16 sm:w-[72px] sm:h-[72px] overflow-hidden border-2 bg-amber-50 transition-all ${
                          mainImage === thumbnail
                            ? "border-amber-700"
                            : "border-gray-200 hover:border-amber-600"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <ProductImage
                          src={thumbnail}
                          fallbackSrc={imageFallback(thumbnail)}
                          alt={`${product.name} ${index + 1}`}
                          width={72}
                          height={72}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:gap-4">
              <h1 className="text-4xl md:text-[clamp(1.5rem,4vw,2.5rem)] font-bold italic tracking-wide m-0 text-secondary-blue font-signature">
                {CATEGORY_CONFIG[baseProduct.category]?.displayName || product.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl md:text-[clamp(1.25rem,3vw,1.75rem)] font-bold">
                    {currency}
                    {Number(displayPrice || 0).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title: product.name, url }).catch((e) => {
                          if (e?.name !== 'AbortError') navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
                        });
                      } else {
                        navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
                      }
                    }}
                    className="text-primary-brown cursor-pointer hover:opacity-60 transition-opacity"
                    aria-label="Share product"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
                <div
                  className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() =>
                    document
                      .getElementById("reviews-section-anchor")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  {heroRatingLabel != null ? (
                    <>
                      <StarRow
                        rating={Math.round(parseFloat(heroRatingLabel))}
                        size={18}
                      />
                      <span className="font-semibold">{heroRatingLabel}</span>
                      <span className="text-sm" style={{ color: "#554433" }}>
                        {heroReviewCount} reviews
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Loading reviews...
                    </span>
                  )}
                </div>
              </div>
              <p className="leading-relaxed m-0 text-base">
                {product.description}
              </p>
              {showVariantSelector && (
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 lg:mt-6">
                  {CATEGORY_CONFIG[baseProduct.category].variants.map(
                    (variant) => (
                      <div key={variant.label}>
                        <button
                          onClick={() => setSelectedVariant(variant.label)}
                          className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer ${selectedVariant === variant.label ? 'bg-[var(--primary-brown)] text-white' : 'text-primary-brown border border-[var(--primary-brown)] hover:bg-[var(--primary-brown)] hover:text-white'}`}
                        >
                          {variant.label}
                        </button>
                        {selectedVariant === variant.label &&
                          variant.disclaimer && (
                            <p className="text-xs text-gray-500 mt-1">
                              {variant.disclaimer}
                            </p>
                          )}
                      </div>
                    ),
                  )}
                </div>
              )}
              {showPackSelector && (
                <div className="flex flex-col gap-2 mt-3 lg:mt-4">
                  <label className="text-sm font-bold tracking-wider uppercase">
                    {packLabel}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {packOptionsConfig.options.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`px-4 py-2 text-sm font-medium transition-all cursor-pointer ${effectivePackId === pack.id ? 'bg-[var(--primary-brown)] text-white' : 'text-primary-brown border border-primary-brown hover:bg-[var(--primary-brown)] hover:text-white'}`}
                      >
                        {pack.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 lg:mt-8">
                <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
                  <div className="flex border border-primary-brown overflow-hidden shrink-0 h-11 sm:h-12 w-[108px] sm:w-[120px]">
                    <button
                      className="w-9 sm:w-10 p-0 border-none cursor-pointer text-lg sm:text-xl transition-colors hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 bg-white text-primary-brown"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      disabled={quantity === 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="flex-1 border-none border-x border-secondary-blue text-center text-sm sm:text-base focus:outline-none min-w-0 text-primary-brown cursor-default"
                      aria-label="Quantity"
                    />
                    <button
                      className="w-9 sm:w-10 p-0 border-none cursor-pointer text-lg sm:text-xl transition-colors hover:bg-amber-50 flex items-center justify-center shrink-0 bg-white text-primary-brown"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="flex-1 min-w-0 h-11 sm:h-12 px-2 sm:px-4 border border-[var(--primary-brown)] bg-[var(--primary-brown)] text-xs sm:text-base font-bold uppercase tracking-wide cursor-pointer transition-colors text-white hover:bg-[var(--primary-brown)]/90 flex items-center justify-center gap-2"
                    onClick={handleAddToBag}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <>
                        <svg
                          className="animate-spin"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="30"
                            strokeLinejoin="round"
                            className="opacity-30"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>ADDING...</span>
                      </>
                    ) : (
                      "ADD TO BAG"
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 lg:mt-8 lg:pt-8">
                {["details", "ingredients", "how-to-use"].map((key) => (
                  <div
                    key={key}
                    className="border-b"
                    style={{ borderColor: "#d4c5b2" }}
                  >
                    <button
                      className="w-full flex items-center justify-between py-3 lg:py-4 text-left"
                      onClick={() =>
                        setOpenAccordion(openAccordion === key ? null : key)
                      }
                    >
                      <span className="text-base font-semibold uppercase tracking-wider">
                        {key === "how-to-use"
                          ? "How to Use"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-300 ${openAccordion === key ? "rotate-180" : ""}`}
                        style={{ color: "#554433" }}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openAccordion === key ? "max-h-96 pb-4" : "max-h-0"}`}
                    >
                      {key === "how-to-use" ? (
                        <ul
                          className="leading-relaxed text-sm list-disc pl-4"
                          style={{ color: "#554433" }}
                        >
                          {product.accordion["how-to-use"].map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className="leading-relaxed text-sm"
                          style={{ color: "#554433" }}
                        >
                          {product.accordion[key]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-6 md:py-16">
          <h1 className="text-4xl md:text-[clamp(2.5rem,4vw,3.5rem)] font-bold tracking-wide text-center m-0 mb-12 text-secondary-blue font-signature">
            faq
          </h1>
          <div>
            {FAQ_ITEMS.map((faq) => (
              <div
                key={faq.key}
                className="border-b"
                style={{ borderColor: "#d4c5b2" }}
              >
                <button
                  className="w-full flex items-center justify-between py-4 text-left"
                  onClick={() =>
                    setOpenAccordion(openAccordion === faq.key ? null : faq.key)
                  }
                >
                  <span className="text-sm md:text-base font-semibold uppercase tracking-wider">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${openAccordion === faq.key ? "rotate-180" : ""}`}
                    style={{ color: "#554433" }}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openAccordion === faq.key ? "max-h-96 pb-4" : "max-h-0"}`}
                >
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: "#554433" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DecadeSection product={product} />
        <PostcardsSection product={product} />
        {/* <YouMayAlsoLike contained className="!px-0 py-10" /> */}
        <ReviewsSection
          product={product}
          onStatsChange={handleReviewStatsChange}
        />
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}

export { ProductDetailView, ALL_PRODUCTS };