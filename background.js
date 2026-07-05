// Create the context menus when the extension is installed
chrome.runtime.onInstalled.addListener( () => {
  chrome.contextMenus.create( {
    id: "booru_sd_menu",
    title: "Export tags for Local SD",
    // Show this menu on both Rule34 and Gelbooru post pages
    documentUrlPatterns: [
      "*://*.rule34.xxx/index.php?page=post&s=view*",
      "*://*.gelbooru.com/index.php?page=post&s=view*"
    ]
  } );

  chrome.contextMenus.create( {
    id: "import_pony",
    parentId: "booru_sd_menu",
    title: "Import to Pony v6"
  } );

  chrome.contextMenus.create( {
    id: "import_animagine",
    parentId: "booru_sd_menu",
    title: "Import to AnimagineXL40"
  } );
} );

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
  if ( info.menuItemId === "import_pony" || info.menuItemId === "import_animagine" ) {
    chrome.scripting.executeScript( {
      target: { tabId: tab.id },
      func: extractAndFormatTags,
      args: [ info.menuItemId ]
    } );
  }
} );

// The core function that runs inside the webpage
function extractAndFormatTags( modelId ) {
  const categories = [ 'character', 'copyright', 'artist', 'general', 'metadata' ];
  const tags = { character: [], copyright: [], artist: [], general: [], metadata: [] };

  categories.forEach( cat => {
    // Select links inside the sidebar lists (works on both R34 and Gelbooru)
    const elements = document.querySelectorAll( `li.tag-type-${cat} a` );
    elements.forEach( el => {
      const text = el.innerText.trim();
      // Filter out '?', '+', '-', and numbers (like tag counts)
      if ( text && text !== '?' && text !== '+' && text !== '−' && text !== '-' && !/^\d+$/.test( text ) ) {
        tags[ cat ].push( text.replace( /_/g, ' ' ) );
      }
    } );
  } );

  // Remove duplicate entries
  const chars = [ ...new Set( tags.character ) ];
  const series = [ ...new Set( tags.copyright ) ];
  const general = [ ...new Set( tags.general ) ];

  let finalPrompt = "";

  if ( modelId === "import_pony" ) {
    // PONY V6 XL FORMAT
    const ponyPrefix = "score_9, score_8_up, score_7_up, score_6_up, score_5_up";
    const body = [ ...chars, ...series, ...general ].join( ", " );
    finalPrompt = `${ponyPrefix}, ${body}, source_pony, rating_explicit`;

  } else if ( modelId === "import_animagine" ) {
    // ANIMAGINE XL 4.0 FORMAT
    const animagineSuffix = "masterpiece, high score, great score, absurdres";

    let parts = [];
    if ( chars.length > 0 ) parts.push( chars.join( ", " ) );
    if ( series.length > 0 ) parts.push( series.join( ", " ) );
    if ( general.length > 0 ) parts.push( general.join( ", " ) );

    finalPrompt = `${parts.join( ", " )}, ${animagineSuffix}`;
  }

  // Copy to clipboard and trigger popup confirmation
  navigator.clipboard.writeText( finalPrompt ).then( () => {
    const popup = document.createElement( "div" );
    popup.textContent = `Copied tags for ${modelId === 'import_pony' ? 'Pony v6' : 'Animagine XL 4.0'}!`;

    popup.style.cssText = `
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      background: #0cac49; 
      color: white; 
      padding: 16px 24px; 
      border-radius: 8px; 
      z-index: 999999; 
      font-family: sans-serif; 
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
      transition: opacity 0.4s;
    `;

    document.body.appendChild( popup );

    setTimeout( () => { popup.style.opacity = '0'; }, 2000 );
    setTimeout( () => { popup.remove(); }, 2400 );
  } ).catch( err => {
    alert( "Extension failed to copy prompt: " + err );
  } );
}