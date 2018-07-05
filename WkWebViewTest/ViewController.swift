//
//  ViewController.swift
//  WkWebViewTest
//
//  Created by Iman Zarrabian on 05/07/2018.
//  Copyright © 2018 One More Thing Studio. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    @IBOutlet weak var webViewContainer: UIView!
    var webView: WKWebView!
    var nbOfLoads = 0
    override func viewDidLoad() {
        super.viewDidLoad()
        configureAndLoadWebView()
        copyFolders()
    }


    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        let alert = UIAlertController(title: "Are you ready?", message: "to experience the White Screen of Death?", preferredStyle: .alert)

        let goAction = UIAlertAction(title: "Ok, Go!", style: .default) { _ in
            self.stressTestWebView(nbOfLoads: 1000)
        }

        alert.addAction(goAction)

        present(alert, animated: true, completion: nil)
    }

    func copyFolders() {
        let filemgr = FileManager.default
        let dirPaths = filemgr.urls(for: .documentDirectory, in: .userDomainMask)
        let docsURL = dirPaths[0]

        let folderPath = Bundle.main.resourceURL!.appendingPathComponent("ContentData").path
        let docsFolder = docsURL.path
        copyFiles(pathFromBundle: folderPath, pathDestDocs: docsFolder)
    }

    func copyFiles(pathFromBundle : String, pathDestDocs: String) {
        let fileManagerIs = FileManager.default

        do {
            let filelist = try fileManagerIs.contentsOfDirectory(atPath: pathFromBundle)
            try? fileManagerIs.copyItem(atPath: pathFromBundle, toPath: pathDestDocs)

            for filename in filelist {
                try? fileManagerIs.copyItem(atPath: "\(pathFromBundle)/\(filename)", toPath: "\(pathDestDocs)/\(filename)")
            }
        } catch {
            print("\nError\n")
        }
    }
    private func configureAndLoadWebView() {
        webView = WKWebView()
        webView.translatesAutoresizingMaskIntoConstraints = false
        webViewContainer.addSubview(webView)
        webView.navigationDelegate = self
        webView.leftAnchor.constraint(equalTo: webViewContainer.leftAnchor).isActive = true
        webView.rightAnchor.constraint(equalTo: webViewContainer.rightAnchor).isActive = true
        webView.topAnchor.constraint(equalTo: webViewContainer.topAnchor).isActive = true
        webView.bottomAnchor.constraint(equalTo: webViewContainer.bottomAnchor).isActive = true
    }

    private func stressTestWebView(nbOfLoads: Int) {
        self.nbOfLoads = nbOfLoads
        loadContent()
    }

    fileprivate func loadContent() {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
        let url = NSURL(fileURLWithPath: documentsPath, isDirectory: true)
        let randomIndex = Int(arc4random() % 3)
        let fileURL = url.appendingPathComponent("FileTemp_\(randomIndex).html")
        self.webView.loadFileURL(fileURL! as URL, allowingReadAccessTo: url as URL)
    }
}

extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("Finished Loading")
        nbOfLoads = nbOfLoads - 1
        if nbOfLoads > 0 {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                print("Loading again ...")
                self.loadContent()
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print(error)
    }
}

