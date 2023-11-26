import re
import sys

def bump(new_ver_v):
	new_ver = new_ver_v.replace("v", "")
	manifest_template = "\"version\": \"" + new_ver + "\""
	updates_template = ''',
        {
          "version": "''' + new_ver + '''",
          "update_link": "https://github.com/zapSNH/zcpt-webextension/releases/download/v''' + new_ver + '''/zapsCoolPhotonTheme.xpi",
          "applications": {
            "gecko": {
                "strict_min_version": "121.0a1"
            }
          }
        }
      ]
    }
  }
}'''
	versioncss_template = "content: \"zapsCoolPhotonTheme v" + new_ver + " (webextension)\";"
	replace(manifest_template, "manifest.json", "\"version\": \".*\"")
	replace(updates_template, "updates.json", "\n.*]\n.*}\n.*}\n.*}")
	replace(versioncss_template, "custom/resources/version.css", "content: \"zapsCoolPhotonTheme v.* \(webextension\)\";")


def replace(new_ver, file, regex):
	f = open(file, "r")

	content = f.read()
	new_content = re.sub(regex, new_ver, content)

	f.close()
	f = open(file, "w")
	f.write(new_content)
	f.close()
	
if __name__ == '__main__':
    globals()[sys.argv[1]](sys.argv[2])