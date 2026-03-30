# Task: Fix dashboard modal display (modal-inicial vs modalinfo-tipos-pago conflict)

## Steps:
- [x] 1. Edit modalinfo-tipos-pago.component.ts: Change localStorage key to 'modalInfoTiposPagoDismissed'
- [x] 2. Confirm modal-inicial.component.ts key (uses 'modalInicialDismissed' correctly)
- [x] 3. Fix modal backdrop stuck: Added manual cleanup in onClose() for both modals
- [ ] 4. Test reload + clear localStorage if needed

## Completed:

