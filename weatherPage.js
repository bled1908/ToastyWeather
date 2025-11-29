const weatherPage = {
    tag: "div",
    attrs: {},
    children: [
  
      // Title
      {
        tag: "h1",
        attrs: { class: "title" },
        children: ["🌦️ Weather Finder"]
      },
  
      // Search Bar
      {
        tag: "div",
        attrs: { class: "search-box" },
        children: [
          {
            tag: "input",
            attrs: { type: "text", id: "city-input", placeholder: "Enter city name..." }
          },
          {
            tag: "button",
            attrs: { id: "search-btn" },
            children: ["Search"]
          }
        ]
      },
  
      // Weather Result Card
      {
        tag: "div",
        attrs: { id: "weather-result", class: "weather-card hidden" },
        children: [
          { tag: "h2", attrs: { id: "city-name" }, children: [] },
          { tag: "p", attrs: { id: "temp" }, children: [] },
          { tag: "p", attrs: { id: "windspeed" }, children: [] }
        ]
      },
  
      // Toast Container
      {
        tag: "div",
        attrs: { id: "toast-container" },
        children: []
      }
    ]
  };
  