export const cars = [
  {
    id: "bmw-750i-1996",
    title: "BMW 750i",
    brand: "BMW",
    model: "750i",
    price: "$1,750,000",
    year: 1996,
    km: "121,043 miles",
    transmission: "Automatic",
    fuel: "Petrol",
    owners: "Second",
    bodyType: "Sedan",
    engine: "5.4L V12",

    location: "Thrissur, KL",
    date: "05 Jan 2026",      // ✅ ADD
    featured: true,           // ✅ ADD

    seller: {
      name: "Akhil Motors",
      place: "Thrissur, Kerala",
      avatar: "https://i.pravatar.cc/100?img=12",
      phone: "+91 98765 43210",
    },

    description: `This 1996 BMW 7 Series features a powerful V12 engine with luxury interior.
Well maintained, single hand driven and no accident history.`,

    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600",
      "https://images.unsplash.com/photo-1605559424931-58e4f01b9d8a?w=1600",
      "https://images.unsplash.com/photo-1605559424856-0d99a3c65bb5?w=1600",
    ],
  },

  {
    id: "audi-rs7-2020",
    title: "Audi RS7",
    brand: "Audi",
    model: "RS7",
    price: "$1,200,000",
    year: 2020,
    km: "15,000 miles",
    transmission: "Automatic",
    fuel: "Petrol",
    owners: "First",
    bodyType: "Sedan",
    engine: "4.0L V8 Twin Turbo",
    location: "Bangalore, KA",
    date: "12 Feb 2026",
    featured: false,
    seller: {
      name: "Elite Cars",
      place: "Bangalore, Karnataka",
      avatar: "https://i.pravatar.cc/100?img=34",
      phone: "+91 91234 56789",
    },
    description: `Experience the thrill of driving a 2020 Audi RS7 with its twin-turbo V8 engine.
Loaded with advanced features and luxurious interiors.`,
    images: [
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=1600",
      "https://images.unsplash.com/photo-1549924230-3c9a4d3f4f4c?w=1600",
      "https://images.unsplash.com/photo-1549924232-5f3b1c4d4e4d?w=1600",
    ],
  },

  {
    id: "porsche-911-carrera-2018",
    title: "Porsche 911 Carrera",
    brand: "Porsche",
    model: "911 Carrera",
    price: "$900,000",
    year: 2018,
    km: "25,000 miles",
    transmission: "Manual",
    fuel: "Petrol",
    owners: "First",
    bodyType: "Coupe",
    engine: "3.0L Flat-6 Turbo",
    location: "Mumbai, MH",
    date: "20 Mar 2026",
    featured: true,
    seller: {
      name: "Luxury Rides",
      place: "Mumbai, Maharashtra",
      avatar: "https://i.pravatar.cc/100?img=56",
      phone: "+91 99876 54321",
    },
    description: `The 2018 Porsche 911 Carrera offers an exhilarating driving experience with its flat-six turbo engine.
Classic design meets modern performance in this iconic sports car.`,
    images: [
      "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b9a?w=1600",
      "https://images.unsplash.com/photo-1519648023501-6d4f4f4f4f4f?w=1600",
      "https://images.unsplash.com/photo-1519648023505-8d4f4f4f4f4f?w=1600",
    ],
  },
];
