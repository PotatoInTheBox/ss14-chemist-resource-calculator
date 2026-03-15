import type { Chemical } from "@model/chemical";
import { encodePreset } from "@model/presetUrl";
import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

interface SharePresetProps {
  ingredients: Chemical[];
  goals: Chemical[];
}

interface SharePresetProps {
  ingredients: Chemical[];
  goals: Chemical[];
}

export function SharePreset({ ingredients, goals }: SharePresetProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    handleShare();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setShareUrl(null);
  };

  const handleShare = () => {
    const encoded = encodePreset(ingredients, goals);
    const url = `${window.location.origin}${window.location.pathname}?preset=${encoded}`;

    setShareUrl(url);
  };

  return (
    <>
      <Button onClick={handleOpen}>Share Current Preset</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Share link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label htmlFor="share-url">Copy this share link:</Form.Label>
            <InputGroup>
              <Form.Control
                id="share-url"
                type="text"
                value={shareUrl || ""}
                readOnly
                onFocus={(e) => e.target.select()}
              />
              {/* The copy button will only show up if the browser gives us permission */}
              {navigator.clipboard?.writeText && (
                <Button
                  variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(shareUrl || "")}
                >
                  Copy
                </Button>
              )}
            </InputGroup>
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
