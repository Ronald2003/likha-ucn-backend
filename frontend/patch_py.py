with open("src/pages/BuyerProfile.jsx", "r") as f:
    text = f.read()

# Replace the closing div of the scrollable area
old_div_structure = """                  </div>
                </div>
              </div>

              {/* Modal Footer */}"""

new_div_structure = """                  </div>
                </div>

              {/* Modal Footer */}"""

text = text.replace(old_div_structure, new_div_structure)

old_footer_end = """                  </button>
              )}
            </div>

          </div>
        </div>"""

new_footer_end = """                  </button>
              )}
            </div>
            
            </div>

          </div>
        </div>"""

text = text.replace(old_footer_end, new_footer_end)

with open("src/pages/BuyerProfile.jsx", "w") as f:
    f.write(text)
print("Done with python")
