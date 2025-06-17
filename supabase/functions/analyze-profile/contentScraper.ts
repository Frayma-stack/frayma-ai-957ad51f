export interface ScrapedContent {
  scrapedContent: Array<{
    url: string;
    content?: string;
    error?: string;
  }>;
}

export class ContentScraper {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
  }

  async scrapeLinkedinContent2(urls: string[]): Promise<ScrapedContent> {
    try {
      if (!urls || !Array.isArray(urls) || urls.length === 0)
        throw new Error("No URLs provided or invalid format");

      console.log("Scraping content from URLs:", urls);
      const scrapedContent: any = [];

      for (const rawUrl of urls) {
        // Clean up the URL (remove trailing commas, etc.)
        const url = rawUrl.replace(/[,\s]+$/, "").trim();
        try {
          console.log(`Fetching content from: ${url}`);
          // Use different user agents for different platforms
          let userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
          if (url.includes("linkedin.com")) {
            // LinkedIn-specific headers
            userAgent =
              "LinkedInBot/1.0 (compatible; Mozilla/5.0; +http://www.linkedin.com/static?key=LinkedInBot)";
          } else if (url.includes("twitter.com") || url.includes("x.com")) {
            // Twitter/X-specific headers
            userAgent = "Twitterbot/1.0";
          }

          const response = await fetch(url, {
            headers: {
              "User-Agent": userAgent,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate",
              DNT: "1",
              Connection: "keep-alive",
            },
            // Longer timeout for potentially slow responses
            signal: AbortSignal.timeout(15000),
          });

          if (!response.ok) {
            console.error(
              `Failed to fetch ${url}: ${response.status} ${response.statusText}`
            );
            // For LinkedIn, provide a helpful error message
            if (url.includes("linkedin.com")) {
              scrapedContent.push({
                url,
                content: "",
                error: `LinkedIn blocking detected (${response.status}). Please provide the LinkedIn profile information manually or use a different professional URL.`,
              });
            } else {
              scrapedContent.push({
                url,
                content: "",
                error: `HTTP ${response.status}: ${response.statusText}`,
              });
            }
            continue;
          }
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          if (!doc) {
            console.error(`Failed to parse HTML from ${url}`);
            scrapedContent.push({
              url,
              content: "",
              error: "Failed to parse HTML content",
            });
            continue;
          }
          // Remove script, style, and other non-content elements
          const elementsToRemove = doc.querySelectorAll(
            "script, style, nav, footer, header, aside, .advertisement, .ads, #sidebar, .cookie-banner, .popup"
          );
          elementsToRemove.forEach((el) => el.remove());
          // Extract meaningful content with platform-specific strategies
          let content = "";
          if (url.includes("linkedin.com")) {
            // LinkedIn-specific content extraction
            const profileSections = doc.querySelectorAll(
              ".pv-about-section, .pv-experience-section, .experience-section, .pv-profile-section, .profile-section"
            );
            const experienceItems = doc.querySelectorAll(
              ".pv-entity__summary-info, .experience-item, .pv-experience-section__experiences"
            );
            const aboutSection = doc.querySelector(
              ".pv-about-section__summary-text, .about-section"
            );
            if (profileSections.length > 0) {
              content = Array.from(profileSections)
                .map((section) => section.textContent || "")
                .join("\n\n");
            } else if (experienceItems.length > 0) {
              content = Array.from(experienceItems)
                .map((item) => item.textContent || "")
                .join("\n\n");
            } else if (aboutSection) {
              content = aboutSection.textContent || "";
            }
          } else if (url.includes("twitter.com") || url.includes("x.com")) {
            // Twitter/X-specific content extraction
            const bioSection = doc.querySelector(
              '[data-testid="UserDescription"], .profile-description, .bio'
            );
            const tweets = doc.querySelectorAll(
              '[data-testid="tweet"], .tweet-text'
            );
            if (bioSection) {
              content = bioSection.textContent || "";
            }
            if (tweets.length > 0) {
              const tweetTexts = Array.from(tweets)
                .slice(0, 5)
                .map((tweet) => tweet.textContent || "")
                .join("\n");
              content = content
                ? `${content}\n\nRecent posts:\n${tweetTexts}`
                : tweetTexts;
            }
          }
          // Fallback to general content extraction
          if (!content || content.trim().length < 50) {
            const mainContent = doc.querySelector(
              "main, article, .content, .main-content, #content, #main, .container"
            );
            if (mainContent) {
              content = mainContent.textContent || "";
            } else {
              const body = doc.querySelector("body");
              content = body?.textContent || "";
            }
          }
          // Clean up the content
          content = content
            .replace(/\s+/g, " ") // Replace multiple whitespace with single space
            .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
            .replace(/\t+/g, " ") // Replace tabs with spaces
            .trim();
          // Limit content length to prevent token overflow but keep more for better analysis
          if (content.length > 12000) {
            content = content.substring(0, 12000) + "...";
          }
          console.log(
            `Successfully scraped ${content.length} characters from ${url}`
          );
          scrapedContent.push({
            url,
            content,
            error: null,
          });
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          let errorMessage = error.message;
          if (url.includes("linkedin.com") && error.message.includes("fetch")) {
            errorMessage =
              "LinkedIn access blocked. Please provide professional information manually.";
          }
          scrapedContent.push({
            url,
            content: "",
            error: errorMessage,
          });
        }
      }
      return scrapedContent;
    } catch (error) {
      console.error("Error in scrape-content function:", error);
      throw new Error("Internal server error: " + error.message);
    }
  }

  async scrapeLinkedInContent(urls: string[]): Promise<ScrapedContent> {
    console.log("Scraping LinkedIn content from URLs:", urls);

    const scrapeResponse = await fetch(
      `${this.supabaseUrl}/functions/v1/scrape-content`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({ urls }),
      }
    );

    if (!scrapeResponse.ok) {
      throw new Error(
        `LinkedIn scraping failed: ${scrapeResponse.status} ${scrapeResponse.statusText}`
      );
    }

    const scrapedData = await scrapeResponse.json();
    console.log(
      "Successfully scraped LinkedIn content from",
      scrapedData.scrapedContent?.length || 0,
      "URLs"
    );

    return scrapedData;
  }

  buildEnhancedPrompt(userPrompt: string, scrapedData: ScrapedContent): string {
    if (!scrapedData?.scrapedContent) {
      return userPrompt;
    }

    const linkedinContent = scrapedData.scrapedContent
      .filter((item) => item.content && item.content.trim().length > 0)
      .map((item, index) => {
        return `--- LinkedIn Content from ${item.url} ---\n${item.content}\n`;
      })
      .join("\n");

    if (linkedinContent) {
      return `${userPrompt}\n\nBELOW IS THE ACTUAL LINKEDIN PROFILE CONTENT. Please analyze this real LinkedIn data to extract professional experiences in the exact format "Title @Company | Duration":\n\n${linkedinContent}`;
    }

    // If no content was successfully scraped, throw an error
    const errors = scrapedData.scrapedContent
      .filter((item) => item.error)
      .map((item) => `${item.url}: ${item.error}`)
      .join(", ");

    throw new Error(
      `Could not extract content from the LinkedIn URLs. LinkedIn scraping errors: ${errors}`
    );
  }
}
